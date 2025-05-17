import { IRoom } from "../database/models/Room";

// Cosine similarity between two vectors
const cosineSimilarity = (a: number[], b: number[]) => {
  const dot = a.reduce((sum, val, i) => sum + val * b[i], 0);
  const magA = Math.sqrt(a.reduce((sum, val) => sum + val ** 2, 0));
  const magB = Math.sqrt(b.reduce((sum, val) => sum + val ** 2, 0));
  if (magA === 0 || magB === 0) {
    return 0; // Return 0 similarity if either vector has zero magnitude
  }
  return dot / (magA * magB);
};

export const duplicateCheck = async (
  room: IRoom,
  embeddedChunks: number[][], 
  url: string
) => {

  // URL check
  const urlDuplicate = room.documents.find(
    (doc) => doc.googleDocsUrl === url
  );
  if (urlDuplicate) return urlDuplicate;

  // Parameters
  const SIM_THRESHOLD = 0.95;
  const MIN_SIMILAR_CHUNKS = 3;

  // Loop
  for (const doc of room.documents) {
    console.log(doc);
    const existingChunks = doc.embeddedChunks;

    let similarCount = 0;

    for (let i = 0; i < embeddedChunks.length; i++) {
      for (let j = 0; j < existingChunks.length; j++) {
        const sim = cosineSimilarity(embeddedChunks[i], existingChunks[j]);
        console.log(sim)

        if (sim >= SIM_THRESHOLD) {
          similarCount++;
          if (similarCount >= MIN_SIMILAR_CHUNKS) {
            return doc; // found enough similar chunks
          }
        }
      }
    }
  }

  return null; // No duplicate found
};
