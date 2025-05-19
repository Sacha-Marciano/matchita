import React from "react";

type DeleteDocModalProps = {
  isOpen: boolean;
  onClose: (state:boolean) => void;
  docId: string;
  handleDeleteDoc: (docId: string) => void;
};

const DeleteDocModal = ({
  isOpen,
  onClose,
  handleDeleteDoc,
  docId,
}: DeleteDocModalProps) => {
  return (
    // Overlay
    <div
      className={` ${
        isOpen ? "block " : "hidden "
      } absolute top-0 bottom-0 right-0 left-0 bg-black/50 flex items-center justify-center`}
    >
      {/* Popup */}
      <div className="h-[420px] w-[345px] bg-bg-alt flex flex-col justify-around p-4 rounded-xl">
        <div className="space-y-4 mt-10">
        <p className="text-xl font-bold text-center"> This action can't be undone !</p>
        <p className="text-xl font-bold text-center">Do you want to delete this doc ?</p>
        </div>
        <div className="flex items-center justify-center gap-4">
          <button onClick={() => onClose(false)}>Cancel</button>
          <button
            className="bg-red-500! text-white!"
            onClick={() => handleDeleteDoc(docId)}
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteDocModal;
