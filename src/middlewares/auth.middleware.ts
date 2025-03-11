import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { User } from "../models/user.model";
import { appConfig } from "../config/config";
import { IRole } from "../models/role.model";
import mongoose from "mongoose";
import { AuthenticatedRequest } from "../types/types";



export const authMiddleware = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) return res.status(403).json({ message: "No token provided" });

    const decoded = jwt.verify(token, appConfig.JWT_SECRET!) as { id: string };
console.log(decoded, "decoded")
const user = await User.findById(decoded.id).populate<{ role: IRole }>("role").lean();
console.log(user, "user")

    if (!user || !user.role) return res.status(401).json({ message: "User not found or role not assigned" });

    req.user = {
      id: (user._id as mongoose.Types.ObjectId).toString(),
      role: user.role.name,
      permissions: user.role.permissions,
    };

    next();
  } catch (err) {
    next(err);
  }
};
