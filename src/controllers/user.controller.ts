import { Request, Response } from "express";
import { asyncHandler } from "../middlewares/asyncHandler";
import { successResponse } from "../utils/successResponse";
import userServices from "../services/user.services";
import allMessages from "../utils/allMessages";

export const addAdminUser = asyncHandler(
  async (req: Request, res: Response) => {
    const user = await userServices.addAdminUser(req.body);
    successResponse(res, user, allMessages.success.created);
  }
);

export const getAdminUser = asyncHandler(
  async (req: Request, res: Response) => {
    const { search, page = 1, limit = 10 } = req.query;
    const user = await userServices.getAdminUser(
      search ? String(search) : "",
      Number(page),
      Number(limit)
    );

    successResponse(res, user, allMessages.success.fetched);
  }
);
