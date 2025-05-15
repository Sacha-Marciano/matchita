import { ChevronDown, ChevronUp } from "lucide-react";
import React, { useState } from "react";
import { IDocument } from "@/app/database/models/Room";
import Tags from "../../ui/Tags";

type FolderCardProps = {
  folder: { folderName: string; documents: IDocument[] };
  handleDeleteDoc: (id: string) => void;
};

const FolderCard = ({ folder, handleDeleteDoc }: FolderCardProps) => {
  const [isFolderOpen, setIsFolderOpen] = useState<boolean>(false);

  return (
    <div
      key={folder.folderName}
      className="border p-2 rounded flex flex-col items-center gap-2"
    >
      <p>
        <strong> {folder.folderName}</strong>
      </p>

      <div className="w-full flex  items-center justify-between ">
        <p>
          <strong>Documents:</strong> {folder.documents.length}
        </p>

        <button onClick={() => setIsFolderOpen(!isFolderOpen)}>
          {isFolderOpen ? (
            <div className="flex items-center gap-1">
              <p>Close Folder</p> <ChevronUp />
            </div>
          ) : (
            <div className="flex items-center gap-1">
              <p>Open Folder</p> <ChevronDown />
            </div>
          )}
        </button>
      </div>
      {isFolderOpen && (
        <div className="flex flex-col w-full p-2 gap-2">
          {folder.documents.map((doc, index) => (
            <div
              key={index}
              className="flex flex-col items-center justify-between gap-2 p-2 w-full border rounded-xl "
            >
              <p className="text-center">
                <strong> {doc.title}</strong>
              </p>
              <div className="flex items-center justify-center gap-2 w-full overflow-hidden flex-wrap">
                <Tags tags={doc.tags} />
              </div>
              <div className="flex gap-2 p-2 ">
                <a
                  href={doc.googleDocsUrl}
                  target="_blank"
                  className="py-2 px-4 bg-primary border border-secondary hover:bg-hover text-matchita-text hover:text-matchita-text-alt shadow-2xl rounded-xl text-nowrap! text-ellipsis! text-sm"
                >
                  Open Doc
                </a>
                <button
                  onClick={() => {
                    handleDeleteDoc(doc._id as string);
                  }}
                  className="bg-red-500! text-white! text-nowrap! text-ellipsis! text-sm!"
                >
                  Delete Doc
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default FolderCard;
