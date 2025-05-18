import { IDocument } from "@/app/database/models/Room";
import { FC, useEffect, useState } from "react";

import VectorizationAnimation from "../../Animations/EmbedAnimation";
import DuplicateCheckAnimation from "../../Animations/DupCheckAnimation";
import ClassificationAnimation from "../../Animations/ClassifyAnimation";
import Tags from "../../ui/Tags";

type RoomModalProps = {
  isOpen: boolean;
  onClose: () => void;
  handleSubmit: (data: string) => void;
  duplicate: IDocument | undefined;
  step: "" | "embed" | "dup-check" | "classify";
  handleSaveAnyway: (docUrl : string) => void;
};

const DocModal: FC<RoomModalProps> = ({
  isOpen,
  onClose,
  handleSubmit,
  duplicate,
  step,
  handleSaveAnyway
}) => {
  const [docUrl, setDocUrl] = useState<string>("");

  useEffect(() => {
    if (!duplicate) setDocUrl("");
  }, [isOpen, duplicate]);

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
        className="bg-white p-4 rounded-xl absolute top-10 bottom-10 left-6 right-6 flex flex-col items-stretch justify-between text-matchita-900"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="space-y-4">
          <h2 className="text-center text-2xl font-bold"> Add a Doc</h2>
          <div className="flex flex-col gap-2">
            <label htmlFor="room-title" className="font-sembold text-xl ">
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
        </div>

        {/* Embed Animation */}
        {step === "embed" && (
          <div className="flex flex-col items-center justify-center h-full w-full">
            <VectorizationAnimation />
            <p className="text-xl font-bold text-matchita-600">
              Vectorizing your document
            </p>
          </div>
        )}

        {/* Duplicate Check Animation */}
        {step === "dup-check" && (
          <div className="flex flex-col items-center justify-center h-full w-full">
            <DuplicateCheckAnimation />
            <p className="text-xl font-bold text-matchita-600">
              Checking for duplicates
            </p>
          </div>
        )}

        {/* Classify Animation */}
        {step === "classify" && (
          <div className="flex flex-col items-center justify-center h-full w-full">
            <ClassificationAnimation />
            <p className="text-xl font-bold text-matchita-600">
              Assigning folder and tags
            </p>
          </div>
        )}

        {/* Duplicate found message and options */}
        {duplicate && (
          <div className="flex flex-col items-center justify-center h-full w-full gap-4">
            <p className="text-xl font-bold text-matchita-600">
              A similar document was found !
            </p>

            {/* Similar Document */}
            <div className="border rounded-2xl p-2 flex flex-col items-center gap-2">
              <p className="font-bold text-center">{duplicate.title}</p>
              <div className="flex items-center justify-center gap-2 w-full overflow-hidden flex-wrap">
                <Tags tags={duplicate.tags} />
              </div>
              <button className="mt-2">
                <a href={duplicate.googleDocsUrl.split("/export")[0] + "/edit?usp=drive_link"}>Open similar document</a>
              </button>
            </div>

            {/* Save anyway button */}

            <button className="bg-amber-500! mt-4 lg:mt-10" onClick={() => handleSaveAnyway(docUrl)}>Save New Doc Anyway</button>
          </div>
        )}

        {/* Upload Button */}
        <button disabled={docUrl === ""} onClick={() => handleSubmit(docUrl)}>
          Upload Doc
        </button>
      </div>
    </div>
  );
};

export default DocModal;
