import { InvokeModelCommand } from "@aws-sdk/client-bedrock-runtime";
import { IRoom } from "../database/models/Room";


export const getNovaClassifyCommand = ( prompt: string) => {
  return new InvokeModelCommand({
    modelId: "amazon.nova-pro-v1:0",
    contentType: "application/json",
    accept: "application/json",
    body: JSON.stringify({
      inferenceConfig: {
        max_new_tokens: 1000,
      },
      messages: [
        {
          role: "user",
          content: [
            {
              text: prompt,
            },
          ],
        },
      ],
    }),
  });
};
