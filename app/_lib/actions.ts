"use server";

import { ChatResponse, Chat } from "./model";
import { z } from "zod";
import { fetchRenderTypeName, sendChat, fetchModel, fetchMCPTool } from "./api";
import { gcsUploadFile } from "./gcs";
import { generateUniqueFilename } from "./utils";

const accessToken = process.env.GPTFLASK_API;
const apiURL = process.env.GPTFLASK_URL;

const FormSchema = z.object({
  model: z.string(),
  personaId: z.coerce.number(),
  outputFormatId: z.coerce.number(),
  prompt: z.string(),
  maxTokens: z.coerce.number().nullable(),
  budgetTokens: z.coerce.number().nullable(),
  mcpTool: z.coerce.number(),
});

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
    mcpTool,
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
    content: prompt,
  };
  console.log("mcp form data:");
  console.log(formData.get("mcpTool"));
  responseHistory.push(userChatResponse);

  // Get Render Type (eg: markdown, html, etc)
  let renderTypeName = "";
  if (outputFormatId) {
    try {
      renderTypeName = await fetchRenderTypeName(`${outputFormatId}`);
    } catch (error) {
      console.error("Error fetching output format render type name", error);
      throw error;
    }
  }

  let modelObj = await fetchModel(model);

  const chat: Chat = {
    responseHistory: responseHistory,
    personaId,
    outputFormatId,
    renderTypeName,
    imageData: null,
    model: modelObj.api_name,
    modelId: modelObj.id,
    prompt,
    imageURL: null,
    maxTokens,
    budgetTokens,
  };

  // If there is a file, we upload to Google Cloud storage and get the URL
  const file = formData.get("image") as File | null;
  if (file) {
    try {
      const uploadURL = await gcsUploadFile(
        generateUniqueFilename(file.name),
        file
      );
      chat.imageData = uploadURL ?? "";
    } catch (error) {
      console.error("Problem uploading file", error);
      throw error;
    }
  }

  // Send chat request with MCP tool if selected
  try {
    let mcpToolData;
    console.log(modelObj.api_vendor_name);
    console.log(mcpTool);
    if (mcpTool > 0 && modelObj.api_vendor_name === "anthropic") {
      console.log("MCP Tool data set");
      mcpToolData = await fetchMCPTool(mcpTool.toString());
      console.log(mcpToolData);
    }
    const result = await sendChat(chat, mcpToolData);

    if (chat.model !== "dall-e-3") {
      responseHistory.push(result as ChatResponse);
      chat.responseHistory = responseHistory;
    } else {
      chat.imageURL = result as string;
    }
  } catch (error) {
    console.error("Failed to send Chat", error);
    throw error;
  }
  return chat;
}
