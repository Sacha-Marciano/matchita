import { NextRequest, NextResponse } from "next/server";
import connectDb from "@/app/lib/mongodb";
import Room from "@/app/database/models/Room";

// Here we get the room by id to display all the document in it
// The uploading of document is handled in /api/upload

export async function POST(req: NextRequest) {
  const { id } = await req.json();

  try {
    await connectDb();
    const room = await Room.findById(id);
    if (!room)
      return NextResponse.json({ error: "Room not found" }, { status: 404 });

    const folders = room.folders.map((roomFolder) => ({
      folderName: roomFolder,
      documents: room.documents.filter((doc) => doc.folder === roomFolder),
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
