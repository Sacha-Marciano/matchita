import { NextRequest, NextResponse } from "next/server";

////////////////////////////////////////////////////////////////////////////////////
//                                                                                //
//    Here we embed the new doc and return the new vector                         //
//                                                                                //
////////////////////////////////////////////////////////////////////////////////////

export async function POST(req: NextRequest) {
  try {
    const { url } = await req.json();
    if (!url) throw new Error("Missing URL or Room ID");


    // 1. Get all variables (rawText, room, ect)
    const text = await fetch(url).then((res) => res.text());
    const rawText = text.toLowerCase().replace(/\s+/g, " ").trim();

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

    // 8. return response
    return NextResponse.json(
      { status: "vectorized", data: embedding },
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
