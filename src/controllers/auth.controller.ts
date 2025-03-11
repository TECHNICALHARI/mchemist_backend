import { Request, Response } from "express";
import { asyncHandler } from "../middlewares/asyncHandler";
import authServices from "../services/auth.services";
import { successResponse } from "../utils/successResponse";
import allMessages from "../utils/allMessages";

export const registerUser = asyncHandler(
  async (req: Request, res: Response) => {
    const user = await authServices.register(req.body);
    successResponse(res, user, allMessages.success.created);
  }
);
export const login = asyncHandler(async (req: Request, res: Response) => {
  const user = await authServices.Login(req.body);
  successResponse(res, user, allMessages.auth.loginSuccess);
});

export const registerAdmin = asyncHandler(
  async (req: Request, res: Response) => {
    const user = await authServices.registerAdmin(req.body);
    successResponse(res, user, allMessages.success.created);
  }
);
export const addAdminUser = asyncHandler(
  async (req: Request, res: Response) => {
    const user = await authServices.addAdminUser(req.body);
    successResponse(res, user, allMessages.success.created);
  }
);
