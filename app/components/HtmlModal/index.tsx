import React from "react";

type HtmlModalProps = {
  html: string;
  onClose: () => void;
};

const HtmlModal: React.FC<HtmlModalProps> = ({ html, onClose }) => {
  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center">
      <div className="bg-white max-w-4xl w-full max-h-[80vh] overflow-y-auto rounded-xl pl-6 py-6 relative no-scrollbar">
        <button
          onClick={onClose}
          className="absolute top-2 right-3 lg:fixed lg:top-[90px] lg:right-[330px] text-gray-600 hover:text-gray-900 px-3!"
        >
          ✕
        </button>
        <div
          className="prose prose-sm max-w-none"
          dangerouslySetInnerHTML={{ __html: html }}
        />
      </div>
    </div>
  );
};

export default HtmlModal;
