import connectDb from "@/app/lib/mongodb";
import Room, { IRoom, IDocument } from "../models/Room";
import { Types } from "mongoose";

// Get all rooms
export async function getAllRooms(): Promise<IRoom[]> {
  await connectDb();
  return Room.find().exec();
}

// Get a room by ID
export async function getRoomById(id: string): Promise<IRoom | null> {
  await connectDb();

  if (!Types.ObjectId.isValid(id)) {
    throw new Error("Invalid room ID");
  }

  return Room.findById(id).exec();
}

// Create a new room
export async function createRoom(data: {
  title: string;
  folders?: string[];
  tags?: string[];
  documents?: IDocument[];
  createdAt :Date;
}): Promise<IRoom> {
  await connectDb();
  const newRoom = new Room({
    ...data,
    folders: data.folders ?? [],
    tags: data.tags ?? [],
    documents:[],
    createdAt: data.createdAt,
  });
  return newRoom.save();
}

export async function addDocumentToRoom(roomId: string, doc: IDocument): Promise<IRoom | null> {
  await connectDb();

  if (!Types.ObjectId.isValid(roomId)) throw new Error("Invalid room ID");

  const updatedRoom = await Room.findByIdAndUpdate(
    roomId,
    { $push: { documents: doc } },
    { new: true }
  );

  return updatedRoom;
}
