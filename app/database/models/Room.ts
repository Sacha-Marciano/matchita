import mongoose, { Schema, Model, Document as MongooseDocument } from "mongoose";

export interface IDocument extends MongooseDocument {
  title: string;
  googleDocsUrl: string;
  folder: string;
  tags: string[];
  vector: number[];
  createdAt: Date;
}

export interface IRoom extends MongooseDocument {
  title: string;
  folders: string[];
  tags: string[];
  documents: IDocument[];
  avatar: string;
  createdAt: Date;
}

const DocumentSchema = new Schema<IDocument>({
  title: { type: String, required: true },
  googleDocsUrl: { type: String, required: true },
  folder: { type: String, required: true },
  tags: { type: [String], default: [] },
  vector: { type: [Number], required: true },
  createdAt: { type: Date, default: Date.now },
});

const RoomSchema = new Schema<IRoom>({
  title: { type: String, required: true },
  folders: { type: [String], default: [] },
  tags: { type: [String], default: [] },
  documents: { type: [DocumentSchema], default: [] },
  avatar: {type: String, required: true},
  createdAt: { type: Date, default: Date.now },
});

const Room: Model<IRoom> = mongoose.models.Room || mongoose.model<IRoom>("Room", RoomSchema);
export default Room;
