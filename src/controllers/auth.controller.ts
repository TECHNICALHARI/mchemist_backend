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



export const initiateRegistration = asyncHandler(async (req: Request, res: Response) => {
  const response = await authServices.initiateRegistration(req.body);
  successResponse(res, response, "OTP sent successfully");
});

export const verifyAndRegister = asyncHandler(async (req: Request, res: Response) => {
  const response = await authServices.verifyAndRegister(req.body);
  successResponse(res, response, "User registered successfully");
});