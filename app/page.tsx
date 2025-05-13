"use client";

import Link from "next/link";
import { useState } from "react";
import RoomModal from "./components/RoomModal";

interface Room {
  _id: string;
  title: string;
}

export default function Home() {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [isRoomModalOpen, setisRoomModalOpen] = useState<boolean>(false);

  const testenv = process.env.MONGO_URL
  const handleCreateRoom = async (roomTitle: string) => {
    const res = await fetch("api/room", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ title: roomTitle }),
    });

    const data = await res.json();
    if (data.error) {
      console.error(data.error);
      return;
    }
    setRooms([...rooms, data.data]);
    setisRoomModalOpen(false);
  };

  // useEffect(() => {
  //   const fetchRooms = async () => {
  //     const res = await fetch("/api/room");
  //     const data = await res.json();
  //     setRooms(data.data);
  //   };

  //   fetchRooms();
  // }, []);

  return (
    <main className="w-full min-h-screen p-4 space-y-4">
      <div className="w-full flex justify-between items-center">
        <h1 className="text-4xl font-bold mb-6">Matchita Rooms</h1>
        <button
          onClick={() => {
            setisRoomModalOpen(true);
          }}
        >
          Create New Room
        </button>
      </div>
      <div className="grid gap-4">
        {rooms.map((room) => (
          <Link
            key={room._id}
            href={`/room/${room._id}`}
            className="block p-4 rounded-lg border hover:bg-gray-100 transition"
          >
            {room.title}
          </Link>
        ))}
      </div>
<p>{testenv} </p>
      <RoomModal
        isOpen={isRoomModalOpen}
        onClose={() => setisRoomModalOpen(false)}
        handleSubmit={handleCreateRoom}
      />
    </main>
  );
}
