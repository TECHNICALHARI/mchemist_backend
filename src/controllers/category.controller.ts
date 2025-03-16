import { Request, Response } from "express";
import { asyncHandler } from "../middlewares/asyncHandler";
import categoryServices from "../services/category.services";
import { successResponse } from "../utils/successResponse";
import allMessages from "../utils/allMessages";

export const addCategoryMany = asyncHandler(
  async (req: Request, res: Response) => {
    const userId = req.user?.id;
    const category = await categoryServices.multiAddCategory(req.body, userId);
    successResponse(res, category, allMessages.success.created);
  }
);
