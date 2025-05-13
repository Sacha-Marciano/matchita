"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import RoomModal from "./components/RoomModal";

interface Room {
  _id: string;
  title: string;
}

export default function Home() {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [isRoomModalOpen, setisRoomModalOpen] = useState<boolean>(false);

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

  const handleDeleteRoom = async (roomId: string) => {
    const res = await fetch("api/room", {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ id: roomId }),
    });
    const data = await res.json();
    if (data.error) {
      console.error(data.error);
      return;
    }
    setRooms(rooms.filter((room) => room._id !== roomId));
  };

  useEffect(() => {
    const fetchRooms = async () => {
      const res = await fetch("/api/room");
      const data = await res.json();
      setRooms(data.data);
    };

    fetchRooms();
  }, []);

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
          <div
            className="flex items-center justify-between p-4 rounded-xl border hover:bg-gray-100 transition "
            key={room._id}
          >
            <Link href={`/room/${room._id}`} className="block p-4 ">
              {room.title}
            </Link>
            <button onClick={() => handleDeleteRoom(room._id)} className="bg-red-500! text-white! ">
              Delete Room
            </button>
          </div>
        ))}
      </div>

      <RoomModal
        isOpen={isRoomModalOpen}
        onClose={() => setisRoomModalOpen(false)}
        handleSubmit={handleCreateRoom}
      />
    </main>
  );
}
