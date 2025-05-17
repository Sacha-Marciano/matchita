import { NextRequest, NextResponse } from "next/server";
import connectDb from "@/app/lib/mongodb";
import { getRoomById } from "@/app/database/services/RoomServices";

import { duplicateCheck } from "@/app/utils/DuplicateCheck";

////////////////////////////////////////////////////////////////////////////////////
//                                                                                //
//   Here we receive the new embedding, new url and the room ID. This route       //
//   return any docs that have a matching url or text similarty > 95%             //
//                                                                                //
////////////////////////////////////////////////////////////////////////////////////

export async function POST(req: NextRequest) {
  try {
    const { embedding, url, roomId } = await req.json();
    if (!url || !roomId || !embedding)
      throw new Error("Missing URL or Room ID");

    await connectDb();

    // 1. Get all variables (rawText, room, ect)
    const room = await getRoomById(roomId);
    if (!room) {
      return NextResponse.json({ error: "Room not found" }, { status: 404 });
    }

    // 3. Check duplicates
    const duplicate = await duplicateCheck(room, embedding, url);

   if (duplicate) {
      return NextResponse.json(
        {
          status: "duplicate",
          data: {
            existingDoc: duplicate,
            existingVector: duplicate.vector,
            newVector: embedding,
          },
        },
        { status: 200 }
      );
    }

    // 8. return response
    return NextResponse.json(
      { status: "OK", data: "no-duplicate" },
      { status: 200 }
    );
  } catch (err) {
    console.error("[UPLOAD ERROR]", err);
    return NextResponse.json(
      { status: "error", message: (err as Error).message },
      { status: 500 }
    );
  }
}
