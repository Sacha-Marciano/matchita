import { NextRequest, NextResponse } from "next/server";
import connectDb from "@/app/lib/mongodb";
import { Types } from "mongoose";
import {
  deleteDocumentFromRoom,
  getRoomById,
} from "@/app/database/services/RoomServices";

// Here we get the room by id to display all the document in it
// The uploading of document is handled in /api/upload

export async function POST(req: NextRequest) {
  const { id } = await req.json();
  if (!Types.ObjectId.isValid(id)) {
    return NextResponse.json(
      { error: "Invalid room or document ID" },
      { status: 400 }
    );
  }
  try {
    await connectDb();
    const room = await getRoomById(id);

    const folders = room?.folders.map((roomFolder) => ({
      folderName: roomFolder,
      documents: room?.documents.filter((doc) => doc.folder === roomFolder),
    }));

    return NextResponse.json(
      { data: { room: room, folders: folders } },
      { status: 200 }
    );
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "Failed to fetch room" },
      { status: 500 }
    );
  }
}

export async function DELETE(req: NextRequest) {
  const { roomId, docId } = await req.json();

  if (!Types.ObjectId.isValid(roomId) || !Types.ObjectId.isValid(docId)) {
    return NextResponse.json(
      { error: "Invalid room or document ID" },
      { status: 400 }
    );
  }

  try {
    await connectDb();

    const updatedRoom = await deleteDocumentFromRoom(roomId, docId);

    if (!updatedRoom) {
      return NextResponse.json({ error: "Room not found" }, { status: 404 });
    }

    const folders = updatedRoom.folders.map((roomFolder) => ({
      folderName: roomFolder,
      documents: updatedRoom.documents.filter(
        (doc) => doc.folder === roomFolder
      ),
    }));

    return NextResponse.json(
      { data: { room: updatedRoom, folders: folders } },
      { status: 200 }
    );
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "Failed to delete document from room" },
      { status: 500 }
    );
  }
}
