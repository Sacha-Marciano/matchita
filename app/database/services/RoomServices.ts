import Room, { IRoom, IDocument } from "../models/Room";
import { Types } from "mongoose";

// Get all rooms
export async function getAllRooms(): Promise<IRoom[]> {
  return Room.find().exec();
}

// Get a room by ID
export async function getRoomById(id: string): Promise<IRoom | null> {

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
  createdAt: Date;
}): Promise<IRoom> {
  const newRoom = new Room({
    ...data,
    folders: data.folders ?? [],
    tags: data.tags ?? [],
    documents: [],
    createdAt: data.createdAt,
  });
  return newRoom.save();
}

// Delete a room by ID
export async function deleteRoomById(id:string): Promise<IRoom | null>{
  if (!Types.ObjectId.isValid(id)) {
    throw new Error("Invalid room ID");
  }

  const deletedRoom = await Room.findByIdAndDelete(id).exec();

  if (!deletedRoom) {
    throw new Error("Room not found");
  }

  return deletedRoom;
}

// Add document to a room by its ID
export async function addDocumentToRoom(
  roomId: string,
  doc: Partial<IDocument>
): Promise<IRoom | null> {

  if (!Types.ObjectId.isValid(roomId)) throw new Error("Invalid room ID");

  const updatedRoom = await Room.findByIdAndUpdate(
    roomId,
    { $push: { documents: doc } },
    { new: true }
  );

  return updatedRoom;
}

// Delete a document from a room by its ID
export async function deleteDocumentFromRoom(
  roomId: string,
  documentId: string
): Promise<IRoom | null> {
  if (!Types.ObjectId.isValid(roomId)) throw new Error("Invalid room ID");
  if (!Types.ObjectId.isValid(documentId)) throw new Error("Invalid document ID");

  // Step 1: Remove the document
  const room = await Room.findByIdAndUpdate(
    roomId,
    { $pull: { documents: { _id: documentId } } },
    { new: true }
  );

  if (!room) return null;

  // Step 2: Extract folders still in use
  const usedFolders = new Set(room.documents.map((doc) => doc.folder));

  // Step 3: Filter out unused folders from room.folders
  const cleanedFolders = room.folders.filter((folder) => usedFolders.has(folder));

  // Step 4: Update the room's folders if needed
  if (cleanedFolders.length !== room.folders.length) {
    room.folders = cleanedFolders;
    await room.save();
  }

  return room;
}

// update room tags and folders. data needs to be {folders: ["new folder"], tags: ["new tag1", "new tag2"]}
export async function updateRoomById(
  roomId: string,
  data: Partial<IRoom>
): Promise<IRoom | null> {
  if (!Types.ObjectId.isValid(roomId)) {
    throw new Error("Invalid room ID");
  }
  const updatePayload: {
    $addToSet?: {
      folders?: { $each: string[] };
      tags?: { $each: string[] };
    };
  } = {};
  
  // Iterate over folders and tags, add only if non existing
  if (data.folders?.length) {
    updatePayload["$addToSet"] = updatePayload["$addToSet"] || {};
    updatePayload["$addToSet"].folders = { $each: data.folders };
  }

  if (data.tags?.length) {
    updatePayload["$addToSet"] = updatePayload["$addToSet"] || {};
    updatePayload["$addToSet"].tags = { $each: data.tags };
  }

  const updatedRoom = await Room.findByIdAndUpdate(roomId, updatePayload, {
    new: true,
  });

  return updatedRoom;
}
