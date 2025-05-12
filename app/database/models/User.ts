import mongoose, { Model, Schema } from "mongoose";

interface IUser {
  name: string;
  email: string;
}

const UserSchema: Schema<IUser> = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
});

const User: Model<IUser> = mongoose.model<IUser>("User", UserSchema);

export default User;
