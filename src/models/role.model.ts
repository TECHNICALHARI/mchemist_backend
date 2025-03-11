import mongoose, { Schema, Document } from "mongoose";
import { PERMISSIONS } from "../utils/permissions";

export interface IRole extends Document {
  name: string;
  permissions: string[];
}

const RoleSchema = new Schema<IRole>(
  {
    name: { type: String, required: true, unique: true },
    permissions: [{ type: String, enum: Object.values(PERMISSIONS), required: true }],
  },
  { timestamps: true, versionKey: false }
);

export const Role = mongoose.model<IRole>("Role", RoleSchema);
