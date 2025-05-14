import { NextRequest, NextResponse } from "next/server";
import { BedrockRuntimeClient } from "@aws-sdk/client-bedrock-runtime";
import { IDocument } from "@/app/database/models/Room";
import connectDb from "@/app/lib/mongodb";
import {
  addDocumentToRoom,
  getRoomById,
  updateRoomById,
} from "@/app/database/services/RoomServices";
import { getClassifyCommand, getClassifyPrompt } from "@/app/utils/ClaudeVars";
import { getVectorizeCommand } from "@/app/utils/TitanVars";
import { duplicateCheck } from "@/app/utils/DuplicateCheck";
import { getNovaClassifyCommand } from "@/app/utils/NovaVars";

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

    // 1. Get all variables (rawText, room, ect)
    const rawText = await fetch(url).then((res) => res.text());
    const room = await getRoomById(roomId);
    if (!room) {
      return NextResponse.json({ error: "Room not found" }, { status: 404 });
    }

    //2. Initialize bedrock client
    const client = new BedrockRuntimeClient({
      region: REGION,
      credentials: {
        accessKeyId: process.env.ACCESS_KEY_ID_AWS!,
        secretAccessKey: process.env.SECRET_ACCESS_KEY_AWS!,
      },
    });

    // 3. Vectorize using Titan
    const embedCommand = getVectorizeCommand(rawText.slice(0, 20000));

    const embedRes = await client.send(embedCommand);
    const embedParsed = JSON.parse(Buffer.from(embedRes.body).toString());
    const embedding = embedParsed.embedding as number[];

    // 4. Check duplicates
    const duplicate = await duplicateCheck(room, embedding, url);

    if (duplicate) {
      return NextResponse.json(
        { status: "duplicate", existingDoc: duplicate },
        { status: 200 }
      );
    }

    // 5. Ask Claude for classification
    const claudePrompt = getClassifyPrompt(room, rawText);

    const claudeCommand = getClassifyCommand(claudeModelId, claudePrompt);
    const novaCommand = getNovaClassifyCommand(claudePrompt);
    const response = await client.send(claudeCommand);
    const responseBody = JSON.parse(new TextDecoder().decode(response.body));
    const { title, folder, tags } = JSON.parse(responseBody.content[0].text);

    // 6. Save inside room
    const newDoc: Partial<IDocument> = {
      title: title,
      googleDocsUrl: url,
      folder: folder,
      tags: tags,
      vector: embedding,
      createdAt: new Date(),
    };
    await addDocumentToRoom(roomId, newDoc);

    // 7. Update room tags and folders
    const dataToUpdate = { folders: [folder], tags: tags };
    const newRoom = await updateRoomById(roomId, dataToUpdate);

    const newFolders = newRoom?.folders.map((roomFolder) => ({
      folderName: roomFolder,
      documents: newRoom.documents.filter((doc) => doc.folder === roomFolder),
    }));

    // 8. return response
    return NextResponse.json(
      { status: "saved", data: { newDoc: newDoc, newFolders: newFolders } },
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
