import { Request, Response, NextFunction } from "express";
import { ZodError } from "zod";

export const errorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
  let statusCode = err.statusCode || 500;
  let message = err.message || "Internal Server Error";
  let errorDetails = null;

  if (err instanceof ZodError) {
    statusCode = 400;
    message = "Validation Error";
    errorDetails = err.errors.map((e) => ({
      field: e.path.join("."),
      message: e.message,
    }));
  }

  console.error("Error:", err);

  return res.status(statusCode).json({
    success: false,
    message,
    error: errorDetails,
  });
};
