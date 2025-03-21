import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  // Render Types
  const markdownType = await prisma.renderType.upsert({
    where: { id: 1 },
    update: { name: "markdown" },
    create: { name: "markdown" },
  });

  const htmlType = await prisma.renderType.upsert({
    where: { id: 2 },
    update: { name: "html" },
    create: { name: "html" },
  });

  // API Vendors
  const openaiVendor = await prisma.aPIVendor.upsert({
    where: { id: 1 },
    update: { name: "openai" },
    create: { name: "openai" },
  });

  const anthropicVendor = await prisma.aPIVendor.upsert({
    where: { id: 2 },
    update: { name: "anthropic" },
    create: { name: "anthropic" },
  });

  const googleVendor = await prisma.aPIVendor.upsert({
    where: { id: 3 },
    update: { name: "google" },
    create: { name: "google" },
  });

  const openRouterVendor = await prisma.aPIVendor.upsert({
    where: { id: 4 },
    update: { name: "openrouter" },
    create: { name: "openrouter" },
  });

  // Persona
  await prisma.persona.upsert({
    where: { id: 1 },
    update: { name: "General", prompt: "You are a helpful assistant" },
    create: { name: "General", prompt: "You are a helpful assistant" },
  });

  // Output Formats
  await prisma.outputFormat.upsert({
    where: { id: 1 },
    update: {
      name: "Markdown",
      prompt: "Format your response in Markdown format.",
      renderTypeId: markdownType.id,
    },
    create: {
      name: "Markdown",
      prompt: "Format your response in Markdown format.",
      renderTypeId: markdownType.id,
    },
  });

  await prisma.outputFormat.upsert({
    where: { id: 2 },
    update: {
      name: "Plain Text",
      prompt:
        "Format your response in plain text. Do not use Markdown or HTML.",
      renderTypeId: htmlType.id,
    },
    create: {
      name: "Plain Text",
      prompt:
        "Format your response in plain text. Do not use Markdown or HTML.",
      renderTypeId: htmlType.id,
    },
  });

  await prisma.outputFormat.upsert({
    where: { id: 3 },
    update: {
      name: "HTML/Tailwind",
      prompt:
        "Format your response as HTML using html tags and tailwind css classes. Use hyperlinks to link to resources but only if helpful and possible. Do not use Markdown or wrap your response in markdown. Only include what is between the html body tag. Do not use ``` tags.",
      renderTypeId: htmlType.id,
    },
    create: {
      name: "HTML/Tailwind",
      prompt:
        "Format your response as HTML using html tags and tailwind css classes. Use hyperlinks to link to resources but only if helpful and possible. Do not use Markdown or wrap your response in markdown. Only include what is between the html body tag. Do not use ``` tags.",
      renderTypeId: htmlType.id,
    },
  });

  // Models
  await prisma.model.upsert({
    where: { id: 1 },
    update: {
      apiName: "gpt-4o",
      name: "GPT-4o",
      isVision: true,
      isImageGeneration: false,
      isThinking: false,
      apiVendorId: openaiVendor.id,
    },
    create: {
      apiName: "gpt-4o",
      name: "GPT-4o",
      isVision: true,
      isImageGeneration: false,
      isThinking: false,
      apiVendorId: openaiVendor.id,
    },
  });

  await prisma.model.upsert({
    where: { id: 2 },
    update: {
      apiName: "gpt-3.5-turbo",
      name: "GPT 3.5 Turbo",
      isVision: false,
      isImageGeneration: false,
      isThinking: false,
      apiVendorId: openaiVendor.id,
    },
    create: {
      apiName: "gpt-3.5-turbo",
      name: "GPT 3.5 Turbo",
      isVision: false,
      isImageGeneration: false,
      isThinking: false,
      apiVendorId: openaiVendor.id,
    },
  });

  await prisma.model.upsert({
    where: { id: 3 },
    update: {
      apiName: "o1-preview",
      name: "o1 Preview",
      isVision: false,
      isImageGeneration: false,
      isThinking: false,
      apiVendorId: openaiVendor.id,
    },
    create: {
      apiName: "o1-preview",
      name: "o1 Preview",
      isVision: false,
      isImageGeneration: false,
      isThinking: false,
      apiVendorId: openaiVendor.id,
    },
  });

  await prisma.model.upsert({
    where: { id: 4 },
    update: {
      apiName: "dall-e-3",
      name: "DALL-E-3",
      isVision: false,
      isImageGeneration: true,
      isThinking: false,
      apiVendorId: openaiVendor.id,
    },
    create: {
      apiName: "dall-e-3",
      name: "DALL-E-3",
      isVision: false,
      isImageGeneration: true,
      isThinking: false,
      apiVendorId: openaiVendor.id,
    },
  });

  await prisma.model.upsert({
    where: { id: 5 },
    update: {
      apiName: "claude-3-opus-20240229",
      name: "Claude 3 Opus",
      isVision: false,
      isImageGeneration: false,
      isThinking: false,
      apiVendorId: anthropicVendor.id,
    },
    create: {
      apiName: "claude-3-opus-20240229",
      name: "Claude 3 Opus",
      isVision: false,
      isImageGeneration: false,
      isThinking: false,
      apiVendorId: anthropicVendor.id,
    },
  });

  await prisma.model.upsert({
    where: { id: 6 },
    update: {
      apiName: "claude-3-5-sonnet-20240620",
      name: "Claude 3.5 Sonnet",
      isVision: false,
      isImageGeneration: false,
      isThinking: false,
      apiVendorId: anthropicVendor.id,
    },
    create: {
      apiName: "claude-3-5-sonnet-20240620",
      name: "Claude 3.5 Sonnet",
      isVision: false,
      isImageGeneration: false,
      isThinking: false,
      apiVendorId: anthropicVendor.id,
    },
  });

  await prisma.model.upsert({
    where: { id: 7 },
    update: {
      apiName: "claude-3-7-sonnet-20250219",
      name: "Claude  3.7 Sonnet",
      isVision: false,
      isImageGeneration: false,
      isThinking: true,
      apiVendorId: anthropicVendor.id,
    },
    create: {
      apiName: "claude-3-7-sonnet-20250219",
      name: "Claude  3.7 Sonnet",
      isVision: false,
      isImageGeneration: false,
      isThinking: true,
      apiVendorId: anthropicVendor.id,
    },
  });

  await prisma.model.upsert({
    where: { id: 8 },
    update: {
      apiName: "gemini-2.0-flash-exp",
      name: "Gemini Flash 2.0",
      isVision: false,
      isImageGeneration: true,
      isThinking: false,
      apiVendorId: googleVendor.id,
    },
    create: {
      apiName: "gemini-2.0-flash-exp",
      name: "Gemini Flash 2.0",
      isVision: false,
      isImageGeneration: true,
      isThinking: false,
      apiVendorId: googleVendor.id,
    },
  });

  await prisma.model.upsert({
    where: { id: 9 },
    update: {
      apiName: "deepseek/deepseek-chat",
      name: "DeepSeek V3",
      isVision: false,
      isImageGeneration: false,
      isThinking: false,
      apiVendorId: openRouterVendor.id,
    },
    create: {
      apiName: "deepseek/deepseek-chat",
      name: "DeepSeek V3",
      isVision: false,
      isImageGeneration: false,
      isThinking: false,
      apiVendorId: openRouterVendor.id,
    },
  });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
