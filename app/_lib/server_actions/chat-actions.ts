"use server";

import { ChatResponse, Chat, LocalChat } from "../model";
import { chatRepository } from "../db/repositories/chat.repository";
import { getModel } from "./model.actions";
import { getRenderTypeName } from "./render-type.actions";
import { getMcpTool } from "./mcp-tool.actions";
import { getApiVendor } from "./api_vendor.actions";
import { getPersona } from "./persona.actions";
import { supabaseUploadFile } from "../storage";
import { generateUniqueFilename } from "../utils";
import { FormSchema } from "../form-schemas";
import { getOutputFormat } from "./output-format.actions";
import { getCurrentAPIUser } from "../auth"; // Import correct auth helper
import { userRepository } from "../db/repositories/user.repository"; // Import user repository

export async function createChat(
  formData: FormData,
  responseHistory: ChatResponse[]
) {
  const {
    model,
    personaId,
    outputFormatId,
    prompt,
    maxTokens,
    budgetTokens,
    mcpTool, // Keep parsing the mcpTool ID from the form
  } = FormSchema.parse({
    model: formData.get("model"),
    personaId: formData.get("persona"),
    outputFormatId: formData.get("outputFormat"),
    prompt: formData.get("prompt"),
    maxTokens: formData.get("maxTokens") || null,
    budgetTokens: formData.get("budgetTokens") || null,
    mcpTool: formData.get("mcpTool") || 0,
  });
  const userChatResponse: ChatResponse = {
    role: "user",
    content: [{ type: "text", text: prompt }],
  };
  responseHistory.push(userChatResponse);

  // Get Render Type (eg: markdown, html, etc)
  let renderTypeName = "";
  if (outputFormatId) {
    try {
      renderTypeName = await getRenderTypeName(outputFormatId);
    } catch (error) {
      // Log details, but don't throw, allow chat to proceed without render type if needed
      console.error("Error fetching output format render type name:", error);
      renderTypeName = "markdown"; // Default or fallback render type
    }
  }

  let modelObj = await getModel(Number(model));
  if (!modelObj) {
    throw new Error(`Model with ID ${model} not found`);
  }

  // Get persona prompt if personaId exists
  let systemPrompt;
  if (personaId) {
    try {
      const persona = await getPersona(personaId);
      systemPrompt = persona?.prompt;
    } catch (error) {
      // Log details, but don't throw, allow chat to proceed without persona prompt
      console.error("Error fetching persona:", error);
      // personaPrompt remains undefined, which is handled later
    }
  }
  let outputFormatPrompt;
  if (outputFormatId) {
    try {
      const outputFormat = await getOutputFormat(outputFormatId);
      outputFormatPrompt = outputFormat?.prompt;
    } catch (error) {
      // Log details, but don't throw, allow chat to proceed without output format prompt
      console.error("Error fetching Output Format:", error);
      // outputFormatPrompt remains undefined
    }
    // Combine prompts safely, handling undefined cases
    systemPrompt = [systemPrompt, outputFormatPrompt].filter(Boolean).join(" ");
  }

  const chat: LocalChat = {
    responseHistory: responseHistory,
    personaId,
    outputFormatId,
    renderTypeName,
    imageURL: null,
    model: modelObj.apiName,
    modelId: modelObj.id,
    prompt,
    visionUrl: null,
    maxTokens,
    budgetTokens,
    systemPrompt: systemPrompt,
    mcpToolId: mcpTool, // Add the mcpToolId directly to the chat object
  };

  // If there is a file, we upload to Supabase storage and get the URL
  const file = formData.get("image") as File | null;
  if (file && file.name !== "undefined") {
    try {
      const uploadURL = await supabaseUploadFile(
        generateUniqueFilename(file.name),
        file
      );
      if (uploadURL) {
        chat.visionUrl = uploadURL;
      }
    } catch (error) {
      // Log details, but don't throw, allow chat to proceed without the image if upload fails
      console.error("Problem uploading file:", error);
      // chat.imageData remains null
    }
  }

  // --- Usage Limit Check ---
  try {
    // Get the full user object from our DB using the helper
    const user = await getCurrentAPIUser();
    if (!user) {
      // getCurrentAPIUser returns null if not authenticated or user doesn't exist in DB yet
      throw new Error("Authentication required or user not found.");
    }
    // Check usage limit before proceeding using the user's DB ID
    await userRepository.checkUsageLimit(user.id);
  } catch (error) {
    console.error("Usage limit check failed:", error);
    // Re-throw the specific error message if it's the usage limit one
    if (
      error instanceof Error &&
      error.message.startsWith("Usage limit exceeded")
    ) {
      throw error; // Let the calling code handle this specific error
    }
    // Otherwise, throw a generic error
    throw new Error("Failed to verify user usage limits.");
  }
  // --- End Usage Limit Check ---

  // Send chat request
  try {
    // The repository now handles fetching the tool based on chat.mcpToolId

    // Call sendChat with only the chat object
    console.log(
      `---CHAT ACTION OBJECT BEGIN---${JSON.stringify(chat)}---CHAT ACTION OBJECT END---`
    );
    const result = await chatRepository.sendChat(chat);

    // Handle DALL-E response or standard chat response
    if (chat.model !== "dall-e-3") {
      responseHistory.push(result as ChatResponse);
      chat.responseHistory = responseHistory;
      // Clear image data after sending while keeping the URL in response history
      if (chat.visionUrl) {
        chat.imageURL = null;
      }
    } else {
      chat.imageURL = result as string;
    }
  } catch (error) {
    console.error("Failed to send Chat:", error); // Log detailed error
    // Note: The specific "Usage limit exceeded" error is now caught *before* this block.
    // This block catches errors from chatRepository.sendChat itself.
    throw new Error("Failed to process chat request. Please try again.");
  }
  return chat;
}
