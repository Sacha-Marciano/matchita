import { IDocument } from "@/app/database/models/Room";
import React from "react";
import Tags from "../../ui/Tags";

type DocCardProps = {
  doc: IDocument;
  handleDeleteDoc: (id: string) => void;
};

const DocCard = ({ doc, handleDeleteDoc }: DocCardProps) => {
  return (
    <div
      key={doc.title}
      className="flex flex-col w-full p-2 gap-2 border rounded-2xl"
    >
      <p className="text-center">
        <strong> {doc.title}</strong>
      </p>
      <div className="flex items-center justify-center gap-2 w-full overflow-hidden flex-wrap">
        <Tags tags={doc.tags} />
      </div>
      <div className="flex gap-2 items-center justify-center w-full p-2">
        <a
          href={doc.googleDocsUrl}
          target="_blank"
          className="py-2 px-4 bg-matchita-400 border border-secondary hover:bg-hover text-matchita-text hover:text-matchita-text-alt shadow-2xl rounded-xl text-nowrap text-ellipsis text-sm"
        >
          Open Doc
        </a>
        <button
          onClick={() => {
            handleDeleteDoc(doc._id as string);
          }}
          className="bg-red-500! text-white! text-nowrap! text-ellipsis! text-sm! "
        >
          Delete Doc
        </button>
      </div>
    </div>
  );
};

export default DocCard;
