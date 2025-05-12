import { NextRequest, NextResponse } from "next/server";
import {
  BedrockRuntimeClient,
  InvokeModelCommand,
} from "@aws-sdk/client-bedrock-runtime";
import RoomModel, { IDocument } from "@/app/database/models/Room";
import connectDb from "@/app/lib/mongodb";
import {
  addDocumentToRoom,
  updateRoomById,
} from "@/app/database/services/RoomServices";

////////////////////////////////////////////////////////////////////////////////////
// Basically the most important route. Almost all AI interactions are made here   //
//                                                                                //
//                      HANDLE WITH CARE !!!                                      //
//                                                                                //
////////////////////////////////////////////////////////////////////////////////////

const REGION = process.env.REGION_AWS!;
// const titanModelId = "amazon.titan-embed-text-v2:0";
const claudeModelId = "eu.anthropic.claude-3-7-sonnet-20250219-v1:0";

export async function POST(req: NextRequest) {
  try {
    const { url, roomId } = await req.json();
    if (!url || !roomId) throw new Error("Missing URL or Room ID");

    await connectDb();

    // 1. Fetch raw text from Google Doc
    const rawText = await fetch(url).then((res) => res.text());

    //2. Initialize bedrock client
    const client = new BedrockRuntimeClient({
      region: REGION,
      credentials: {
        accessKeyId: process.env.ACCESS_KEY_ID_AWS!,
        secretAccessKey: process.env.SECRET_ACCESS_KEY_AWS!,
      },
    });

    // 3. Vectorize using Titan
    // const bedrock = new BedrockRuntimeClient({ region: REGION });
    // const embedCommand = new InvokeModelCommand({
    //   modelId: titanModelId,
    //   contentType: "application/json",
    //   body: JSON.stringify({ inputText: rawText }),
    // });
    // const embedRes = await bedrock.send(embedCommand);
    // const embedParsed = JSON.parse(Buffer.from(embedRes.body).toString());
    // const embedding = embedParsed.embedding as number[];

    // 4. Get room and check duplicates
    const room = await RoomModel.findById(roomId);
    if (!room) {
      return NextResponse.json({ error: "Room not found" }, { status: 404 });
    }

    // const cosineSim = (a: number[], b: number[]) => {
    //   const dot = a.reduce((sum, val, i) => sum + val * b[i], 0);
    //   const magA = Math.sqrt(a.reduce((sum, val) => sum + val ** 2, 0));
    //   const magB = Math.sqrt(b.reduce((sum, val) => sum + val ** 2, 0));
    //   return dot / (magA * magB);
    // };

    // const duplicate = room.documents.find((doc) => cosineSim(doc.vector, embedding) >= 0.9);
    // if (duplicate) {
    //   return NextResponse.json({ status: "duplicate", existingDocId: duplicate._id }, { status: 200 });
    // }

    // 5. Ask Claude for classification
    const claudePrompt = `
      You are a document classification assistant.

      Here are the available folders:
      ${JSON.stringify(room.folders)}

      Here are the available tags:
      ${JSON.stringify(room.tags)}

      Analyze the following document:
      """
      ${rawText.split("").splice(0, 2000).join("")}
      """

      Suggest the most appropriate title, folder name and up to 5 tags. The best is to use existing folder names and tags.
      If you can't find a good match, provide the best possible folder name and/or tags. You can also mix between new and existing tags.

      I will do JSON.parse() on your response so output only this , without any other text or '''json:

      {"title": "Document Title","folder": "Folder Name","tags": ["tag1", "tag2", "tag3"]}
      `.trim();

    const claudeCommand = new InvokeModelCommand({
      modelId: claudeModelId,
      contentType: "application/json",
      accept: "application/json",
      body: JSON.stringify({
        anthropic_version: "bedrock-2023-05-31",
        messages: [{ role: "user", content: claudePrompt }],
        max_tokens: 1000,
      }),
    });

    // Handle data
    const response = await client.send(claudeCommand);
    const responseBody = JSON.parse(new TextDecoder().decode(response.body));
    const { title, folder, tags } = JSON.parse(responseBody.content[0].text);

    // 6. Save inside room
    const newDoc: IDocument = {
      title: title,
      googleDocsUrl: url,
      folder: folder,
      tags: tags, 
      vector: [0.1, 0.2, 0.3], // Replace later with Titan embedding,
      createdAt: new Date(),
    };
    await addDocumentToRoom(roomId, newDoc);

    // 7. Update room tags and folders
    const dataToUpdate = { folders: [folder], tags: tags };
    await updateRoomById(roomId, dataToUpdate);

    // 8. return response
    return NextResponse.json(
      { status: "saved", data: newDoc },
      { status: 201 }
    );
  } catch (err) {
    console.error("[UPLOAD ERROR]", err);
    return NextResponse.json(
      { status: "error", message: (err as Error).message },
      { status: 500 }
    );
  }
}
