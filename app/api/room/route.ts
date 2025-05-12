import { NextRequest, NextResponse } from "next/server";

import { createRoom, getAllRooms } from "@/app/database/services/RoomServices";

// fetches all rooms to display in home page
export async function GET(){
  try{
  const res = await getAllRooms();
  return NextResponse.json(
    { message: "Rooms fetched", data: res },
    { status: 200 }
  );
  }catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "An error occured on /upload" },
      { status: 500 }
    );
  }
}

// Add a new room to the DB
export async function POST(req: NextRequest) {
  try {
    const { title } = await req.json();

    const newRoom = await createRoom({
        title,
        folders:[],
        tags: [],
        documents:[],
        createdAt: new Date(),
    })

    return NextResponse.json(
      { message: "Room Created", data: newRoom },
      { status: 201 }
    );
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "An error occured on /upload" },
      { status: 500 }
    );
  }
}


