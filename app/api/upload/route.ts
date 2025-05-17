import { NextRequest, NextResponse } from "next/server";
import { IDocument } from "@/app/database/models/Room";
import connectDb from "@/app/lib/mongodb";
import {
  addDocumentToRoom,
  getRoomById,
  updateRoomById,
} from "@/app/database/services/RoomServices";

import { duplicateCheck } from "@/app/utils/DuplicateCheck";

////////////////////////////////////////////////////////////////////////////////////
// Basically the most important route. Almost all AI interactions are made here   //
//                                                                                //
//                      HANDLE WITH CARE !!!                                      //
//                                                                                //
////////////////////////////////////////////////////////////////////////////////////


export async function POST(req: NextRequest) {
  try {
    const { url, roomId } = await req.json();
    if (!url || !roomId) throw new Error("Missing URL or Room ID");

    await connectDb();

    // 1. Get all variables (rawText, room, ect)
    const text = await fetch(url).then((res) => res.text());
    const rawText = text.toLowerCase().replace(/\s+/g, " ").trim();
    const room = await getRoomById(roomId);
    if (!room) {
      return NextResponse.json({ error: "Room not found" }, { status: 404 });
    }

    //2. Vectorize with relevance
    const vectorRes = await fetch(
      "https://hook.eu2.make.com/2vo5qg2wbxmdtbnuwr0g621yck9beqpf",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: rawText }),
      }
    );
    const embedding = await vectorRes.json();

    // 3. Check duplicates
    const duplicate = await duplicateCheck(room, embedding, url);

    if (duplicate) {
      return NextResponse.json(
        {
          status: "duplicate",
          data: {
            existingDoc: duplicate,
            newVector: embedding,
          },
        },
        { status: 200 }
      );
    }

    // 5. Ask Relevance for classification
    const classRes = await fetch(
      "https://hook.eu2.make.com/vs6yf57y3lut588928dykaodh9xc1kpy",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          text: rawText,
          folders: room.folders,
          tags: room.tags,
        }),
      }
    );

    const classification = await classRes.json();
    const { title, folder, tags } = classification;

    // 6. Save inside room
    const newDoc: Partial<IDocument> = {
      title: title,
      googleDocsUrl: url,
      folder: folder,
      tags: tags,
      embeddedChunks: embedding,
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
