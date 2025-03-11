import mongoose, { Schema, Document, Types } from "mongoose";
import { IRole } from "./role.model";

export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  phone: string;
  role: Types.ObjectId | IRole;
}

const UserSchema = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  phone: { type: String, required: true },
  role: { type: Schema.Types.ObjectId, ref: "Role", required: true },
}, {timestamps: true, versionKey: false});

export const User = mongoose.model<IUser>("User", UserSchema);
