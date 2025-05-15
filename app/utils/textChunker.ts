export function chunkText(text: string, chunkSize = 500, overlap = 50): string[] {
    const words = text.split(" ");
    const chunks = [];
  
    for (let i = 0; i < words.length; i += chunkSize - overlap) {
      const chunk = words.slice(i, i + chunkSize).join(" ");
      if (chunk.trim().length > 0) chunks.push(chunk.trim());
    }
  
    return chunks;
  }
  