import { InvokeModelCommand } from "@aws-sdk/client-bedrock-runtime";

export const getVectorizeCommand = (text: string) => {
  const payload = {
    inputText: text,
    dimensions: 512,
    normalize: true,
  };

  return new InvokeModelCommand({
    modelId: "amazon.titan-embed-text-v2:0",
    contentType: "application/json",
    accept: "*/*",
    body: JSON.stringify(payload),
  });
};
