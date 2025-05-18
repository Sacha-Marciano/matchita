// File: /app/api/chat/route.ts
import { NextRequest, NextResponse } from "next/server";
import connectDb from "@/app/lib/mongodb";
import { getRoomById } from "@/app/database/services/RoomServices";

export async function POST(req: NextRequest) {
  try {
    const { question, roomId } = await req.json();

    if (!question || !roomId) {
      throw new Error("Missing question or roomId");
    }

    console.log("Connecting to DB...");
    await connectDb();

    console.log("Fetching room...");
    const room = await getRoomById(roomId);
    if (!room || !room.documents.length) {
      return NextResponse.json(
        { error: "Room not found or empty" },
        { status: 404 }
      );
    }

    // Step 1: Extract document metadata
    const docMetadataList = room.documents.map((doc) => ({
      id: (doc._id as string).toString(),
      title: doc.title,
      googleDocsUrl: doc.googleDocsUrl,
      tags: doc.tags,
      // preview: doc.textPreview || "", // Add a short preview when saving the doc
    }));

    console.log("Calling AI agent to rank documents...");
    const selectorRes = await fetch(
      "https://hook.eu2.make.com/p9obz9grcjdi7h9tvi1jnnuku7pbv2oa",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          question,
          documents: docMetadataList,
        }),
      }
    );

    const rawSelectorRes = await selectorRes.text();
    console.log("Raw selector response:", rawSelectorRes);

    const parsedRes = JSON.parse(rawSelectorRes);
    const rankedDocIds: string[] = parsedRes.rankedDocIds;

    // Step 2: Try answering the question from each top-ranked document
    // for (const docId of rankedDocIds) {
    // const doc = room.documents.find((d) => (d._id as string).toString() === docId);
    // if (!doc) continue;

    // console.log("Fetching text for doc:", doc.title);
    // const fullText = await fetch(doc.googleDocsUrl).then((res) => res.text());

    // console.log("Calling AI agent to extract answer...");
    // const answerRes = await fetch(
    //   "https://hook.eu2.make.com/your-qa-hook", // Replace with your actual Make webhook
    //   {
    //     method: "POST",
    //     headers: { "Content-Type": "application/json" },
    //     body: JSON.stringify({
    //       question,
    //       text: fullText.slice(0, 70000), // Truncate if needed
    //     }),
    //   }
    // );

    // const answerData = await answerRes.json();

    // if (answerData?.answer && answerData.answer.trim()) {
    //   console.log("Found valid answer in doc:", doc.title);
    //   return NextResponse.json({
    //     status: "answered",
    //     data: {
    //       answer: answerData.answer,
    //       sourceTitle: doc.title,
    //       sourceUrl: doc.googleDocsUrl,
    //     },
    //   });
    // }

    // console.log("No answer found in doc:", doc.title);
    // }

    console.log(rankedDocIds[0]);
    const doc = room.documents.find(
      (d) => (d._id as string).toString() === rankedDocIds[0]
    );
    if (!doc) return;

    console.log("Fetching text for doc:", doc.title);
    const fullText = await fetch(doc.googleDocsUrl).then((res) => res.text());

    console.log("Calling AI agent to extract answer...");
    const answerRes = await fetch(
      "https://hook.eu2.make.com/d1p1dt2hlyexss31oirpf8l6aujkp63c", // Replace with your actual Make webhook
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          question,
          text: fullText.slice(0, 70000), // Truncate if needed
        }),
      }
    );

    const rawAnswerRes = await answerRes.text();
    console.log("Answer response:", rawAnswerRes);

    const parsedAnswer = JSON.parse(rawAnswerRes);
    const answerData: { answer: string; note: string } = parsedAnswer;

    if (answerData?.answer && answerData.answer.trim()) {
      console.log("Found valid answer in doc:", doc.title);
      return NextResponse.json({
        status: "answered",
        data: {
          answer: answerData.answer,
          sourceTitle: doc.title,
          sourceUrl: doc.googleDocsUrl,
          agentNote: answerData.note,
        },
      });
    }

    console.log("No answer found in doc:", doc.title);

    // If no answer found in any of the top docs
    return NextResponse.json({
      status: "no-match",
      answer: "Sorry, I couldn't find an answer in the documents.",
    });
  } catch (err) {
    console.error("[CHAT ERROR]", err);
    return NextResponse.json(
      { error: (err as Error).message },
      { status: 500 }
    );
  }
}
