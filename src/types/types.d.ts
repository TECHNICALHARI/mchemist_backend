import { Request } from "express";

export interface fileType {
  [fieldname: string]: Express.Multer.File[];
}

export interface AuthenticatedRequest extends Request {
  user?: {
    id: string;
    role: string;
    permissions: string[];
  };
}
