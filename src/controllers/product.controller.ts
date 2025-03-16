import { Request, Response } from "express";
import { asyncHandler } from "../middlewares/asyncHandler";
import productServices from "../services/product.services";
import { successResponse } from "../utils/successResponse";
import allMessages from "../utils/allMessages";

export const addMultiProduct = asyncHandler(
  async (req: Request, res: Response) => {
    const userId = req.user?.id;
    const product = await productServices.addManyProduct(req.body, userId);
    successResponse(res, product, allMessages.success.created);
  }
);
export const addProduct = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.user?.id;
  const product = await productServices.addProduct(req.body, userId);
  successResponse(res, product, allMessages.success.created);
});

export const getProduct = asyncHandler(async (req: Request, res: Response) => {
  const { search, limit = 10, page = 1 } = req.query;
  const product = await productServices.getProduct(
    search ? String(search) : "",
    Number(limit),
    Number(page)
  );
  successResponse(res, product, allMessages.success.fetched);
});
