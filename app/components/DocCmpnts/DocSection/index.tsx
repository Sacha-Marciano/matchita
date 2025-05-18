import { IDocument } from "@/app/database/models/Room";
import React from "react";
import DocCard from "../DocCard";

type DocSectionProps = {
  docToDisplay: IDocument[];
  handleDeleteDoc: (id: string) => void;
};

const DocSection = ({ docToDisplay, handleDeleteDoc }: DocSectionProps) => {
  return (
    <div className="text-matchita-900 bg-bg-alt p-2 mt-4 rounded-2xl h-[65vh] overflow-y-auto">
      <h2 className="text-xl font-semibold mb-4 text-center">Documents</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
        {docToDisplay.map((doc) => (
          <DocCard key={doc.title} doc={doc} handleDeleteDoc={handleDeleteDoc} />
        ))}
      </div>
    </div>
  );
};

export default DocSection;
