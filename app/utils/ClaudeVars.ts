import { InvokeModelCommand } from "@aws-sdk/client-bedrock-runtime";
import { IRoom } from "../database/models/Room";

export const getClassifyPrompt = (room : IRoom, rawText : string) => {
    return `
      You are a document classification assistant.

      Here are the existing folders:
      ${JSON.stringify(room.folders)}

      Here are the existing tags:
      ${JSON.stringify(room.tags)}

      Analyze the following document:
      """
      ${rawText.slice(0, 10000)}
      """

      Suggest the most appropriate title, folder name and up to 5 tags.
      If you can't find a good match, provide the best possible folder name and/or tags. You can also mix between new and existing tags.
      Be specific and concise when naming a folder or a tag.

      I will do JSON.parse() on your response so output only this , without any other text or '''json:

      {"title": "Document Title","folder": "Folder Name","tags": ["tag1", "tag2", "tag3"]}
      `.trim();
}

export const getClassifyCommand = (claudeModelId : string, prompt : string) => {
  return new InvokeModelCommand({
        modelId: claudeModelId,
        contentType: "application/json",
        accept: "application/json",
        body: JSON.stringify({
          anthropic_version: "bedrock-2023-05-31",
          messages: [
            { role: "user", content: [{ type: "text", text: prompt }] },
          ],
          max_tokens: 1000,
        }),
      });
}