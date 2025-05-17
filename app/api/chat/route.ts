// // File: /app/api/chat/route.ts
// import { NextRequest, NextResponse } from "next/server";
// import connectDb from "@/app/lib/mongodb";
// import { getRoomById } from "@/app/database/services/RoomServices";

// export async function POST(req: NextRequest) {
//   try {
//     const { question, roomId } = await req.json();
//     if (!question || !roomId) {
//       throw new Error("Missing question or roomId");
//     }

//     await connectDb();
//     const room = await getRoomById(roomId);
//     if (!room || !room.documents.length) {
//       return NextResponse.json(
//         { error: "Room not found or empty" },
//         { status: 404 }
//       );
//     }

//     // Step 1: Vectorize the user question
//     const embedRes = await fetch(
//         "https://hook.eu2.make.com/2vo5qg2wbxmdtbnuwr0g621yck9beqpf",
//         {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ text: question }),
//       }
//     );

//     const questionEmbedding = await embedRes.json();

//     // Step 2: Find matching document(s)
//     const cosineSim = (a: number[], b: number[]) => {
//       const dot = a.reduce((sum, val, i) => sum + val * b[i], 0);
//       const magA = Math.sqrt(a.reduce((sum, val) => sum + val ** 2, 0));
//       const magB = Math.sqrt(b.reduce((sum, val) => sum + val ** 2, 0));
//       return dot / (magA * magB);
//     };

//     const matches = room.documents
//       .map((doc) => ({
//         ...doc,
//         similarity: cosineSim(doc.embeddedChunks, questionEmbedding),
//       }))
//       .filter((doc) => doc.similarity >= 0.8)
//       .sort((a, b) => b.similarity - a.similarity);

//     if (!matches.length) {
//       return NextResponse.json({
//         status: "no-match",
//         answer: "No relevant documents found.",
//       });
//     }

//     const topDoc = matches[0];
//     const docText = await fetch(topDoc.googleDocsUrl).then((res) => res.text());

//     // Step 3: Ask the agent via Make.com
//     const agentRes = await fetch(
//       "https://hook.eu2.make.com/i14r3xclbuzrnsa0zebfsw514c6ljcy8",
//       {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({
//           question,
//           text: docText.slice(0, 70000), // truncate if needed
//         }),
//       }
//     );

//     const agentAnswer = await agentRes.json();

//     return NextResponse.json({
//       status: "answered",
//       data: {
//         answer: agentAnswer,
//         sourceTitle: topDoc.title,
//         sourceUrl: topDoc.googleDocsUrl,
//       },
//     });
//   } catch (err) {
//     console.error("[CHAT ERROR]", err);
//     return NextResponse.json(
//       { error: (err as Error).message },
//       { status: 500 }
//     );
//   }
// }
