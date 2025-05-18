import { NextRequest, NextResponse } from "next/server";
import { IDocument } from "@/app/database/models/Room";
import connectDb from "@/app/lib/mongodb";
import {
  addDocumentToRoom,
  getRoomById,
  updateRoomById,
} from "@/app/database/services/RoomServices";

////////////////////////////////////////////////////////////////////////////////////
//                                                                                //
//   This routes must be triggered after the duplicate check and receives all the //
//    new doc info in order to classify it and save it in MongoDB                 //
//                                                                                //
////////////////////////////////////////////////////////////////////////////////////

export async function POST(req: NextRequest) {
  try {
    const { embeddedChunks, url, roomId } = await req.json();
    if (!url || !roomId || !embeddedChunks) throw new Error("Missing URL or Room ID");

    await connectDb();

    // 1. Get all variables (rawText, room, ect)
    const text = await fetch(url).then((res) => res.text());
    const room = await getRoomById(roomId);
    if (!room) {
      return NextResponse.json({ error: "Room not found" }, { status: 404 });
    }

    // 5. Ask Relevance for classification
    const classRes = await fetch(
      "https://hook.eu2.make.com/vs6yf57y3lut588928dykaodh9xc1kpy",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          text: text,
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
      embeddedChunks: embeddedChunks,
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
