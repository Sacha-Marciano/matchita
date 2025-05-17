// File: /app/chat/page.tsx
"use client";
import { useState } from "react";

export default function ChatPage() {
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [source, setSource] = useState<{ title: string; url: string } | null>(null);
  const [loading, setLoading] = useState(false);
  const roomId = "6825025e707874e5671c0753"; // Hardcoded or injected as needed

  const handleAsk = async () => {
    setLoading(true);
    setAnswer("");
    setSource(null);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question, roomId }),
      });

      const data = await res.json();

      if (data.status === "answered") {
        setAnswer(data.data.answer);
        setSource({ title: data.data.sourceTitle, url: data.data.sourceUrl });
      } else {
        setAnswer(data.answer || "No answer available.");
      }
    } catch (err) {
      console.error("Chat error:", err);
      setAnswer("Error fetching answer.");
    }

    setLoading(false);
  };

  return (
    <div className="max-w-xl mx-auto mt-10 p-4">
      <h1 className="text-2xl font-bold mb-4">Ask Matchita</h1>

      <textarea
        className="w-full p-2 border rounded mb-2"
        rows={4}
        value={question}
        onChange={(e) => setQuestion(e.target.value)}
        placeholder="Type your question about the documents..."
      />

      <button
        onClick={handleAsk}
        className="bg-blue-600 text-white px-4 py-2 rounded disabled:opacity-50"
        disabled={loading || !question}
      >
        {loading ? "Asking..." : "Ask"}
      </button>

      {answer && (
        <div className="mt-6">
          <h2 className="font-semibold mb-2">Answer</h2>
          <p className="whitespace-pre-wrap">{answer}</p>
          {source && (
            <p className="mt-2 text-sm text-gray-500">
              Source:{" "}
              <a href={source.url} target="_blank" rel="noopener noreferrer" className="underline">
                {source.title}
              </a>
            </p>
          )}
        </div>
      )}
    </div>
  );
}
