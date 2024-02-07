"use server";

import { unstable_noStore as noStore } from "next/cache";
import { Chat, ChatResponse, PersonaPost } from "./model";
import { z } from "zod";
import { revalidatePath, revalidateTag } from "next/cache";
import { redirect } from "next/navigation";
import { getUserSession } from "./auth";

const accessToken = process.env.GPTFLASK_API;
const apiURL = process.env.GPTFLASK_URL;

export async function fetchPersonas() {
  //await new Promise((resolve) => setTimeout(resolve, 3000));
  try {
    const result = await fetch(`${apiURL}/api/personas`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      next: { tags: ["personas"] },
    });
    const data = await result.json();
    return data;
  } catch (error) {
    console.log("ERROR!!!");
    console.log(error);
  }
}

const FormSchema = z.object({
  name: z.string(),
  prompt: z.string(),
});

export async function createPersona(formData: FormData) {
  noStore();

  const persona: PersonaPost = FormSchema.parse({
    name: formData.get("name"),
    prompt: formData.get("prompt"),
  });

  try {
    const result = await fetch(`${apiURL}/api/personas`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(persona),
    });
    //const data = await result.json()
    //return data
  } catch (error) {
    console.log("ERROR!!!");
    console.log(error);
    throw new Error("Unable to create Persona.");
  }
  revalidatePath("/settings/personas");
  revalidateTag("personas");
  redirect("/settings/personas");
}

export async function deletePersona(id: string) {
  console.log("Delete invoice");
  try {
    const result = await fetch(`${apiURL}/api/personas/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
    });
    if (result.ok) {
      console.log("Persona Deleted");
    } else {
      console.log(result.status);
    }
  } catch (error) {
    console.log("Error deleting persona");
    console.log(error);
    throw new Error("Error deleting persona");
  }

  revalidatePath("/settings/personas");
}

export async function fetchModels() {
  try {
    const result = await fetch(`${apiURL}/api/models`, {
      next: { tags: ["models"] },
    });
    const data = await result.json();
    return data;
  } catch (error) {
    console.log("ERROR!!!");
    console.log(error);
  }
}

export async function fetchModelByAPIName(api_name: string) {
  noStore();

  try {
    const result = await fetch(`${apiURL}/api/models/api_name/${api_name}`);
    const data = await result.json();
    return data;
  } catch (error) {
    console.log("ERROR!!!");
    console.log(error);
  }
}

export async function fetchOutputFormats() {
  try {
    const result = await fetch(`${apiURL}/api/output-formats`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      next: { tags: ["outputFormats"] },
    });
    const data = await result.json();
    return data;
  } catch (error) {
    console.log("ERROR!!!");
    console.log(error);
  }
}

export async function fetchOutputFormat(id: number) {
  try {
    const result = await fetch(`${apiURL}/api/output-formats/${id}`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
    });
    const data = await result.json();
    return data;
  } catch (error) {
    console.log("ERROR!!!");
    console.log(error);
  }
}

export async function fetchRenderTypeName(outputFormatId: number) {
  try {
    const output_format = await fetchOutputFormat(outputFormatId);
    return output_format.render_type_name;
  } catch (error) {
    console.log("Can't fetch output format render type");
  }
}

export async function createOutputFormat(formData: FormData) {
  noStore();

  const persona: PersonaPost = FormSchema.parse({
    name: formData.get("name"),
    prompt: formData.get("prompt"),
  });

  try {
    const result = await fetch(`${apiURL}/api/output-formats`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(persona),
    });
    //const data = await result.json()
    //return data
  } catch (error) {
    console.log("ERROR!!!");
    console.log(error);
    throw new Error("Unable to create Output Format.");
  }
  revalidatePath("/settings/output-formats");
  revalidateTag("outputFormats");
  redirect("/settings/output-formats");
}

export async function deleteOutputFormat(id: string) {
  try {
    const result = await fetch(`${apiURL}/api/output-formats/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
    });
    if (result.ok) {
      console.log("Output Format Deleted");
    } else {
      console.log(result.status);
    }
  } catch (error) {
    console.log("Error deleting output format");
    console.log(error);
    throw new Error("Error deleting output format");
  }

  revalidatePath("/settings/output-formats");
}

export async function sendChat(chat: Chat) {
  noStore();
  console.log("Sending chat");
  const endpointURL = chat.model === "dall-e-3" ? "/api/dalle" : "/api/chat";
  try {
    const result = await fetch(`${apiURL}${endpointURL}`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(chat),
    });
    if (!result.ok) {
      throw new Error("There was an issue generating a response");
    }
    const data = await result.json();
    if (chat.model !== "dall-e-3") {
      return data.choices[0].message as ChatResponse;
    } else {
      return data.data[0].url as string;
    }
  } catch (error) {
    console.log("ERROR!!!");
    console.log(error);
    throw error;
  }
}

export async function saveChat(chat: Chat) {
  noStore();
  const userSession = await getUserSession();
  const body = JSON.stringify({ ...chat, ...userSession });
  //console.log(userSession);
  //console.log(`The combined objects are ${body}`);
  try {
    const result = await fetch(`${apiURL}/api/save_chat`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      body: body,
    });
    if (!result.ok) {
      throw new Error("Error saving conversation");
    }
    revalidateTag("history");
    const data = await result.json();
    return data;
  } catch (error) {
    console.log(error);
    throw error;
  }
}

export async function fetchHistory() {
  const userSession = await getUserSession();
  const body = JSON.stringify(userSession);
  console.log(body);

  try {
    const result = await fetch(`${apiURL}/api/history`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      body: body,
      next: { tags: ["history"] },
    });
    if (!result.ok) {
      throw new Error("Error fetching conversation");
    }
    const data = await result.json();
    return data;
  } catch (error) {
    console.log(error);
    throw error;
  }
}

export async function deleteHistory(id: string) {
  const userSession = await getUserSession();
  const body = JSON.stringify(userSession);

  try {
    const result = await fetch(`${apiURL}/api/history/delete/${id}`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      body: body,
    });
    if (result.ok) {
      console.log("History Deleted");
    } else {
      console.log(result.status);
    }
  } catch (error) {
    console.log("Error deleting history");
    console.log(error);
    throw new Error("Error deleting history");
  }

  revalidateTag("history");
}