import jwt from "jsonwebtoken";
import { appConfig } from "../config/config";
import { Types } from "mongoose";

export const generateToken = (data: {
  id: string;
  role: string;
}) => {
  return jwt.sign(data, appConfig.JWT_SECRET!, { expiresIn: "1d" });
};


