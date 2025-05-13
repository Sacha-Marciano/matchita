"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import DocModal from "@/app/components/DocModal";
import { IRoom, IDocument } from "@/app/database/models/Room";

interface Document {
  _id?: string;
  title: string;
  folder: string;
  tags: string[];
  googleDocsUrl: string;
}

export default function RoomPage() {
  const { id } = useParams();
  const [room, setRoom] = useState<IRoom>();
  const [folders, setFolders] = useState<
    { folderName: string; documents: IDocument[] }[]
  >([]);
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
      setDocToDisplay([...docToDisplay, data.data.newDoc]);
      setFolders(data.data.newFolders);
      setIsDocModalOpen(false);
    } catch (err) {
      console.error("Error adding document:", err);
    }
  };

  useEffect(() => {
    const fetchRoom = async () => {
      const res = await fetch(`/api/room/${id}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id }),
      });
      const data = await res.json();
      setRoom(data.data.room);
      setFolders(data.data.folders);
      setDocToDisplay(data.data.room.documents);
    };
    fetchRoom();
    console.log(folders);
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

      {/* Folders section */}
      <h2 className="text-xl font-semibold mt-4 mb-2">Folders:</h2>
      <ul className="space-y-2">
        {folders.map((folder, index) => (
          <li
            key={index}
            className="border p-2 rounded flex flex-col items-start"
          >
            <p>
              <strong>Title:</strong> {folder.folderName}
            </p>
            <p>
              <strong>Documents:</strong> {folder.documents.length}
            </p>

            <p className="text-blue-500 border-b border-b-blue-500">
              Open Folder
            </p>
            <div className="flex flex-col w-full p-2 gap-2">
            {folder.documents.map((doc, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-2 w-full border rounded-xl "
              >
                <p>
                  <strong> {doc.title}</strong>
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
              </div>
            ))}
            </div>
          </li>
        ))}
      </ul>

      {/* Document Section */}
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
