import React from "react";

type TagsProps = {
  tags: string[];
};

const Tags = ({ tags }: TagsProps) => {
  return tags.map((tag) => {
    return (
      <div
        key={tag}
        className="text-nowrap  overflow-hidden bg-matchita-400 p-2 px-4 rounded-full text-matchita-900 border border-secondary shadow-xs"
      >
        {tag}
      </div>
    );
  });
};

export default Tags;
