import { IRoom } from "../database/models/Room";

export const duplicateCheck = async (
  room: IRoom,
  embedding: number[],
  url: string
) => {
  const cosineSim = (a: number[], b: number[]) => {
    const dot = a.reduce((sum, val, i) => sum + val * b[i], 0);
    const magA = Math.sqrt(a.reduce((sum, val) => sum + val ** 2, 0));
    const magB = Math.sqrt(b.reduce((sum, val) => sum + val ** 2, 0));
    console.log (dot / (magA * magB));
    return dot / (magA * magB);
  };

  const urlDuplicate = room.documents.find((doc) => doc.googleDocsUrl === url);

  if (urlDuplicate) {
    return urlDuplicate;
  }

  return room.documents.filter((doc) => cosineSim(doc.vector, embedding) >= 0.89);
};
