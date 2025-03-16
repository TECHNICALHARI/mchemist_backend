import crypto from "crypto";
import { Otp } from "../models/otp.model";

export const generateOTP = async (userId: string) => {
  const otp = crypto.randomInt(100000, 999999).toString();
  const expiresAt = new Date(Date.now() + 5 * 60 * 1000);
  await Otp.deleteMany({ userId });
  await Otp.create({ userId, otp, expiresAt });
  return otp;
};

