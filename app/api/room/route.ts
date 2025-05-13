import { NextRequest, NextResponse } from "next/server";

import {
  createRoom,
  deleteRoomById,
  getAllRooms,
} from "@/app/database/services/RoomServices";
import connectDb from "@/app/lib/mongodb";

// fetches all rooms to display in home page
export async function GET() {
  try {
    await connectDb();
    const res = await getAllRooms();
    return NextResponse.json(
      { message: "Rooms fetched", data: res },
      { status: 200 }
    );
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: (err as Error).message },
      { status: 500 }
    );
  }
}

// Add a new room to the DB
export async function POST(req: NextRequest) {
  try {
    await connectDb();
    const { title } = await req.json();

    const newRoom = await createRoom({
      title,
      folders: [],
      tags: [],
      documents: [],
      createdAt: new Date(),
    });

    return NextResponse.json(
      { message: "Room Created", data: newRoom },
      { status: 201 }
    );
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: (err as Error).message },
      { status: 500 }
    );
  }
}

// Delete a room by ID
export async function DELETE(req: NextRequest) {
  const { id } = await req.json();

  try {
    await connectDb();
    const deletedRoom = await deleteRoomById(id);
    if (!deletedRoom) {
      return NextResponse.json({ error: "Room Not found" }, { status: 404 });
    }

    return NextResponse.json(
      { message: "Room Deleted", data: deletedRoom },
      { status: 200 }
    );
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: (err as Error).message },
      { status: 500 }
    );
  }
}
