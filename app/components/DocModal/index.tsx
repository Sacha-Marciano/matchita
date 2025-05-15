import { IDocument } from "@/app/database/models/Room";
import { FC, useEffect, useState } from "react";

type RoomModalProps = {
  isOpen: boolean;
  onClose: () => void;
  handleSubmit: (data: string) => void;
  duplicate: IDocument | undefined;
};

const DocModal: FC<RoomModalProps> = ({
  isOpen,
  onClose,
  handleSubmit,
  duplicate,
}) => {
  const [docUrl, setDocUrl] = useState<string>("");

  useEffect(() => {
    if (!duplicate) setDocUrl("");
  }, [isOpen,duplicate]);

  return (
    // overlay
    <div
      className={`${
        isOpen ? "block" : "hidden"
      } w-screen h-screen flex items-center justify-center bg-black/50 z-50 fixed top-0 left-0`}
      onClick={() => onClose()}
    >
      {/* Modal */}
      <div
        className="bg-white p-4 rounded-xl min-w-[50%] min-h-[50%] flex flex-col items-stretch justify-between text-matchita-900"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex flex-col gap-2">
          <label htmlFor="room-title" className="font-bold text-2xl">
            Doc URL
          </label>
          <input
            type="text"
            id="room-title"
            className="border border-black w-full"
            onChange={(e) => setDocUrl(e.target.value)}
            value={docUrl}
          />
        </div>
        {duplicate && (
          <p className="text-xl font-black text-shadow-pink-600">
            Duplicate found ! : {duplicate?.googleDocsUrl}
          </p>
        )}
        <button onClick={() => handleSubmit(docUrl)}>Upload Doc</button>
      </div>
    </div>
  );
};

export default DocModal;
