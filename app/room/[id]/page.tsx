"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import DocModal from "@/app/components/DocCmpnts/DocModal";
import { IRoom, IDocument } from "@/app/database/models/Room";
import Toggle from "@/app/components/ui/Toggle";
import FolderSection from "@/app/components/Folders/FolderSection";
import DocSection from "@/app/components/DocCmpnts/DocSection";

export default function RoomPage() {
  const { id } = useParams();
  const [room, setRoom] = useState<IRoom>();
  const [folders, setFolders] = useState<
    { folderName: string; documents: IDocument[] }[]
  >([]);
  const [isDocModalOpen, setIsDocModalOpen] = useState<boolean>(false);
  const [docToDisplay, setDocToDisplay] = useState<IDocument[]>([]);
  const [duplicate, setDuplicate] = useState<IDocument>();
  const [dashView, setDashView] = useState<string>("Folders");

  const [step, setStep] = useState<"" | "embed" | "dup-check" | "classify">("");

  const [standByVector, setStandByVector] = useState<number[]>([]);

  useEffect(() => {
    console.log(step);
  }, [step]);

  const handleAddDoc = async (docUrl: string) => {
    const url = docUrl.split("/edit")[0] + "/export?format=txt";

    setDuplicate(undefined);

    try {
      // Embed document
      setStep("embed");

      const embedRes = await fetch("/api/embed", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url }),
      });

      const embedData = await embedRes.json();
      setStandByVector(embedData.data);

      if (embedData.status !== "vectorized") {
        throw new Error("Document embedding failed");
      }

      // Check Duplicate
      setStep("dup-check");

      const dupRes = await fetch("/api/duplicate-check", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ embedding: embedData.data, url, roomId: id }),
      });

      const dupData = await dupRes.json();

      if (dupData.status === "duplicate") {
        setDuplicate(dupData.data.existingDoc);
        setStep("");
        throw new Error("Duplicate found");
      }

      // Classify doc by folder and tags
      setStep("classify");
      const classRes = await fetch("/api/classify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ embedding: embedData.data, url, roomId: id }),
      });

      const classData = await classRes.json();

      if (classData.status !== "saved") {
        throw new Error("Error classifying document");
      }

      // If all promise statuses are OK, update frontend
      setDocToDisplay([...docToDisplay, classData.data.newDoc]);
      setFolders(classData.data.newFolders);
      setIsDocModalOpen(false);
      setDuplicate(undefined);
      setStep("");
    } catch (err) {
      console.error("Error adding document:", err);
    }
  };

  const handleSaveAnyway = async (docUrl: string) => {
    setDuplicate(undefined);
    const url = docUrl.split("/edit")[0] + "/export?format=txt";
    try {
      setStep("classify");
      const classRes = await fetch("/api/classify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ embedding: standByVector, url, roomId: id }),
      });

      const classData = await classRes.json();

      if (classData.status !== "saved") {
        throw new Error("Error classifying document");
      }

      // If all promise statuses are OK, update frontend
      setDocToDisplay([...docToDisplay, classData.data.newDoc]);
      setFolders(classData.data.newFolders);
      setIsDocModalOpen(false);
      setDuplicate(undefined);
      setStep("");
    } catch (err) {
      console.error("Error adding document:", err);
    }
  };

  const handleDeleteDoc = async (docId: string) => {
    try {
      const res = await fetch(`/api/room/${id}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          roomId: id,
          docId: docId,
        }),
      });
      const data = await res.json();
      if (data.error || data.status === "error") {
        console.error("error deleting document:", data.error);
        return;
      }
      const docToFilter = docToDisplay;
      setDocToDisplay(docToFilter.filter((doc) => doc._id !== docId));
      setFolders(data.data.folders);
    } catch (err) {
      console.error("Error deleting document:", err);
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
  }, [id]);

  if (!room) return <div className="p-4">Loading room...</div>;

  return (
    <div className="p-4">
      {/* Head */}
      <div className="w-full flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold ">{room.title}</h1>
        <button
          onClick={() => {
            setIsDocModalOpen(true);
          }}
        >
          Upload new doc
        </button>
      </div>

      {/* Toggle */}
      <Toggle
        options={["Folders", "Documents"]}
        onToggle={(value) => {
          setDashView(value);
        }}
      />

      {/* Folders section */}
      {dashView === "Folders" && (
        <FolderSection folders={folders} handleDeleteDoc={handleDeleteDoc} />
      )}

      {/* Document Section */}
      {dashView === "Documents" && (
        <DocSection
          docToDisplay={docToDisplay}
          handleDeleteDoc={handleDeleteDoc}
        />
      )}

      {/* Add document modal */}
      <DocModal
        isOpen={isDocModalOpen}
        onClose={() => setIsDocModalOpen(false)}
        handleSubmit={handleAddDoc}
        duplicate={duplicate}
        step={step}
        handleSaveAnyway={handleSaveAnyway}
      />
    </div>
  );
}
