import React, { useState, useRef, useEffect } from "react";
import { SendHorizonal } from "lucide-react";

interface IMessage    {
  role: "user" | "agent";
  content: {
    text: string;
    source?: { title: string; url: string };
    agentNote?: string;
  };
}

type ChatWindowProps = {
  roomId: string;
  messages: IMessage[];
  setMessages: React.Dispatch<React.SetStateAction<IMessage[]>>;};

const ChatWindow: React.FC<ChatWindowProps> = ({ roomId, messages, setMessages }) => {
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage = {
      role: "user" as const,
      content: { text: input.trim() },
    };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setLoading(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          question: userMessage.content,
          roomId,
        }),
      });

      const data = await response.json();
      const agentMessage = {
        role: "agent" as const,
        content: {
          text: data.data.answer,
          source: { title: data.data.sourceTitle, url: data.data.sourceUrl },
          agentNote: data.data.agentNote,
        },
      };
      setMessages((prev) => [...prev, agentMessage]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        { role: "agent", content: { text: "Freedom is not worth having if it does not include the freedom to make mistakes.", agentNote:"No matching data was found, please review your query" } },
      ]);
      console.log("no document found:", err)
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="flex flex-col bg-bg-alt p-4 mt-4 rounded-2xl h-[65vh] border border-border text-matchita-900">
      <div className="flex-1 overflow-y-auto space-y-3 pr-2">
        {messages.map((msg, idx) =>
          msg.role === "user" ? (
            <div
              key={idx}
              className={`p-3 rounded-xl max-w-[80%] border whitespace-pre-line ${"bg-primary text-white self-end ml-auto"}`}
            >
              {msg.content.text}
            </div>
          ) : (
            <div
              key={idx}
              className={`p-3 rounded-xl max-w-[80%] whitespace-pre-line border space-y-2 ${"bg-matchita-300 text-matchita-900 self-start mr-auto"}`}
            >
              <p> {msg.content.agentNote}</p>
              <div className="p-2 bg-bg-alt text-matchita-900 rounded-2xl">
                <p className="whitespace-pre-wrap italic text-center">{`"[...] ${msg.content.text} [...]"`}</p>
              </div>
              {msg.content.source && (
                <p className="mt-2 text-sm text-matchita-text-alt">
                  Source:{" "}
                  <a
                    href={msg.content.source.url.split("/export")[0] + "/edit?usp=drive_link"}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="underline"
                  >
                    {msg.content.source.title}
                  </a>
                </p>
              )}
            </div>
          )
        )}
        {loading && (
          <div className="italic text-sm text-gray-500">Thinking...</div>
        )}
        <div ref={chatEndRef} />
      </div>

      <div className="mt-4 flex items-center border border-border rounded-xl bg-white">
        <textarea
          className="flex-1 resize-none p-2 rounded-l-xl bg-transparent focus:outline-none text-matchita-900"
          rows={1}
          placeholder="Ask about your documents..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
        />
        <button
          onClick={handleSend}
          className="p-2 pr-3 text-primary hover:text-primary/80"
          disabled={loading || !input.trim()}
        >
          <SendHorizonal size={20} />
        </button>
      </div>
    </div>
  );
};

export default ChatWindow;
