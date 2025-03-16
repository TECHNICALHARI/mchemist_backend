import mongoose, { Schema } from "mongoose";

export interface IOtp extends Document {
  userId: string;
  otp: string;
  expiresAt: Date;
}

const otpSchema = new Schema<IOtp>({
  userId: { type: String, required: true, ref: "User" },
  otp: { type: String, required: true },
  expiresAt: { type: Date, required: true },
});

export const Otp = mongoose.model<IOtp>("Otp", otpSchema);
