import { IDocument } from "@/app/database/models/Room";
import React from "react";
import FolderCard from "../FolderCard";

type FolderSectionProps = {
  folders: { folderName: string; documents: IDocument[] }[];
  handleDeleteDoc: (id: string) => void;
};

const FolderSection = ({ folders, handleDeleteDoc }: FolderSectionProps) => {
  return (
    <div className="text-matchita-900 bg-bg-alt p-2 mt-4 rounded-2xl h-[65vh] overflow-y-scroll">
      <h2 className="text-xl font-semibold mb-4 text-center">Folders</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
        {folders.map((folder) => (
          <FolderCard
            key={folder.folderName}
            folder={folder}
            handleDeleteDoc={handleDeleteDoc}
          />
        ))}
      </div>
    </div>
  );
};

export default FolderSection;
