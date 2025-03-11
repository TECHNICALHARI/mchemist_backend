import { Response, NextFunction } from "express";
import { AuthenticatedRequest } from "../types/types";

export const requirePermission = (requiredPermission: string) => {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    if (!req.user) {
      res.status(401).json({ message: "Unauthorized" });
      return; // Ensures function exits
    }

    if (!req.user.permissions.includes(requiredPermission)) {
      res.status(403).json({ message: "Permission denied" });
      return; // Ensures function exits
    }

    next(); // Proceed to the next middleware or controller
  };
};
