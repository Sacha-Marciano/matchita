"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import DocModal from "@/app/components/DocModal";

interface Document {
  _id?: string;
  title: string;
  folder: string;
  tags: string[];
  googleDocsUrl: string;
}

export default function RoomPage() {
  const { id } = useParams();
  const [room, setRoom] = useState<any>(null);
  const [isDocModalOpen, setIsDocModalOpen] = useState<boolean>(false);
  const [docToDisplay, setDocToDisplay] = useState<Document[]>([]);

  const handleAddDoc = async (url: string) => {
    try {
      const res = await fetch(`/api/upload`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          url,
          roomId: id,
        }),
      });
      const data = await res.json();
      if (data.error || data.status === "error") {
        console.error("error uploading document:", data.error);
        return;
      }
      setDocToDisplay([...docToDisplay, data.data]);
      setIsDocModalOpen(false);
    } catch (err) {
      console.error("Error adding document:", err);
    }
  };

  useEffect(() => {
    const fetchRoom = async () => {
      const res = await fetch(`/api/room/${id}`);
      const data = await res.json();
      setRoom(data.data);
      setDocToDisplay(data.data.documents);
    };
    fetchRoom();
  }, [id]);

  if (!room) return <div className="p-4">Loading room...</div>;

  return (
    <div className="p-4">
      <div className="w-full flex items-center justify-between">
        <h1 className="text-3xl font-bold mb-4">{room.title}</h1>
        <button
          onClick={() => {
            setIsDocModalOpen(true);
          }}
        >
          Upload new doc
        </button>
      </div>
      <h2 className="text-xl font-semibold mb-2">Documents:</h2>
      <ul className="space-y-2">
        {docToDisplay.map((doc: Document, index: number) => (
          <li key={index} className="border p-2 rounded">
            <p>
              <strong>Title:</strong> {doc.title}
            </p>
            <p>
              <strong>Folder:</strong> {doc.folder}
            </p>
            <p>
              <strong>Tags:</strong> {doc.tags.join(", ")}
            </p>
            <p>
              <a
                href={doc.googleDocsUrl}
                target="_blank"
                className="text-blue-500 underline"
              >
                Open Doc
              </a>
            </p>
          </li>
        ))}
      </ul>
      <DocModal
        isOpen={isDocModalOpen}
        onClose={() => setIsDocModalOpen(false)}
        handleSubmit={handleAddDoc}
      />
    </div>
  );
}
