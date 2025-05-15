import { EllipsisVertical } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import React, { useState } from "react";

type RoomCardProps = {
  _id: string;
  title: string;
  handleDeleteRoom: (roomId: string) => void;
  avatar: string;
};

const RoomCard = ({ _id, title, avatar, handleDeleteRoom }: RoomCardProps) => {
  const [optionsOpen, setOptionsOpen] = useState<boolean>(false);
  return (
    <div
      className="relative flex flex-col items-stretch gap-4  p-4 rounded-xl border border-secondary hover:bg-gray-100 transition bg-bg-alt shadow-2xl"
      key={_id}
    >
      <div className="flex items-center justify-start gap-2 px-2 ">
        <Image
          src={avatar}
          alt="room avatar"
          width={50}
          height={50}
          className="rounded-full border border-secondary"
        />

        <h1 className="text-2xl font-semibold text-matchita-900 "> {title} </h1>
      </div>
      <Link
        href={`/room/${_id}`}
        className="p-2 border rounded-full bg-matchita-600 hover:bg-matchita-300 text-white text-center "
      >
        Open Room
      </Link>
      {/* <button onClick={() => handleDeleteRoom(_id)} className="bg-red-500! text-white! ">
      Delete Room
    </button> */}
      {optionsOpen && (
        <div className="absolute top-2 right-8 bg-bg-alt border-2 border-matchita-900 shadow-lg rounded-lg p-4 flex flex-col gap-2">
          <button disabled>Edit</button>
          <button
            onClick={() => {
              handleDeleteRoom(_id);
              setOptionsOpen(false);
            }}
            className="bg-red-500! "
          >
            Delete Room
          </button>
        </div>
      )}
      <EllipsisVertical
        color="#581c87"
        size={16}
        className="absolute right-2 top-4 cursor-pointer"
        onClick={() => setOptionsOpen(!optionsOpen)}
      />
    </div>
  );
};

export default RoomCard;
