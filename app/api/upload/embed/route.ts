import { chunkText } from "@/app/utils/textChunker";
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
    const rawText = await fetch(url).then((res) => res.text());
    const textChunks = chunkText(rawText); // get chunks of 400 words with 50 words overlapping

    
    //2. Vectorize each chunk with relevance
  const embeddedChunks = await Promise.all(
    textChunks.map(async (chunk) => {
      const vectorRes = await fetch(
        "https://hook.eu2.make.com/2vo5qg2wbxmdtbnuwr0g621yck9beqpf",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ text: chunk }),
        }
      );
      const embedding = await vectorRes.json();

      return embedding;
    })
  );

  // 8. return response
  return NextResponse.json(
    { status: "vectorized", data: embeddedChunks },
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
