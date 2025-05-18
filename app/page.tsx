"use client";

import { useEffect, useState } from "react";
import RoomModal from "./components/Rooms/RoomModal";
import RoomCard from "./components/Rooms/RoomCard";
import Loading from "./components/Loading";

interface Room {
  _id: string;
  title: string;
  avatar : string;
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

   if (rooms.length <= 0)
      return (
        <div className="h-[85vh] w-full flex items-center justify-center">
          <Loading message="Loading Rooms..." />
        </div>
      );

  return (
    <main className="w-full min-h-screen p-4 space-y-4">
      <div className="w-full flex justify-between items-center">
        <h1 className="text-2xl font-bold">Matchita Rooms</h1>
        <button
          onClick={() => {
            setisRoomModalOpen(true);
          }}
        >
          Create New Room
        </button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {rooms.map((room) => (
          <RoomCard
            key={room._id}
            _id={room._id}
            title={room.title}
            avatar={room.avatar}
            handleDeleteRoom={handleDeleteRoom}
          />
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
