import { ChevronDown, ChevronUp, CrossIcon, Expand } from "lucide-react";
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
      className="border p-2 rounded flex flex-col items-center gap-2 "
    >
      <p>
        <strong> {folder.folderName}</strong>
      </p>

      <div className="w-full flex  items-center justify-between ">
        <p>
          <strong>Documents:</strong> {folder.documents.length}
        </p>

        <button onClick={() => setIsFolderOpen(!isFolderOpen)}>

            <div className="flex items-center gap-1">
              <p>Open Folder</p> <Expand size={16}/>
            </div>
          
        </button>
      </div>
      {isFolderOpen && (
        <div className="w-full p-6  absolute bg-bg-alt rounded-xl top-0 bottom-0 left-0 right-0 flex flex-col items-center ">
          <h2 className="text-2xl font-bold"> {folder.folderName} </h2>
        <div className="w-full p-2 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3  overflow-y-auto">
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
                  href={
                    doc.googleDocsUrl.split("/export")[0] +
                    "/edit?usp=drive_link"
                  }
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
          {/* Close folder button */}
          <CrossIcon className="rotate-45 absolute top-4 right-4 cursor-pointer" onClick={() => setIsFolderOpen(false)}/>
        </div>
        </div>
      )}
    </div>
  );
};

export default FolderCard;
