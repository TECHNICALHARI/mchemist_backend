import mongoose from "mongoose";
import { ProductInputTypes, productSchema } from "../validations/product";
import { Product } from "../models/product.model";
import { Response } from "express";
import slugify from "slugify";
import multer from "multer";
import { ApiError } from "../utils/ApiError";
import { statusCodes } from "../utils/statusCodes";
import allMessages from "../utils/allMessages";
import { fileType } from "../types/types";
import { uploadMultipleToCloudinary } from "../utils/cloudinary";

const productServices = {
  addProduct: async (data: ProductInputTypes, files: fileType, userId: mongoose.Types.ObjectId) => {
    const allreadyExist = await Product.findOne({ name: data.name });
    if (allreadyExist) {
      throw new ApiError(
        statusCodes.BAD_REQUEST,
        allMessages.error.alreadyExists
      );
    }
    const imageUrlsFiles = files.imageUrls || [];
    const thumbnailFiles = files.thumbnail || [];
    if (thumbnailFiles?.length === 0) {
      throw new ApiError(
        statusCodes.BAD_REQUEST,
        "Thumbnail image is required."
      );
    }
    if (imageUrlsFiles.length === 0) {
      throw new ApiError(
        statusCodes.BAD_REQUEST,
        "At least one image is required."
      );
    }
    let slug = slugify(data.name, { lower: true, strict: true });
    let uniqueSlug = slug;
    let counter = 1;
    while (await Product.findOne({ slug: uniqueSlug })) {
      uniqueSlug = `${slug}-${counter}`;
      counter++;
    }
    let uploadedImages = await uploadMultipleToCloudinary(files, "products");
    if (!uploadedImages?.thumbnail || uploadedImages.thumbnail.length === 0) {
      throw new ApiError(statusCodes.BAD_REQUEST, "Thumbnail upload failed.");
    }
    if (!uploadedImages?.imageUrls || uploadedImages.imageUrls.length === 0) {
      throw new ApiError(
        statusCodes.BAD_REQUEST,
        "Product images upload failed."
      );
    }
    const parsedData = {
      ...data,
      slug: uniqueSlug,
      mrp: Number(data.mrp),
      saleRate: Number(data.saleRate),
      countInStock: Number(data.countInStock),
      imageUrls: uploadedImages.imageUrls,
      thumbnail: uploadedImages.thumbnail[0],
      createdBy: userId
    };
    const validatedData = productSchema.parse(parsedData)
    const product = await Product.create(validatedData);
    const { createdBy, ...sendProduct } = product.toObject();
    return sendProduct;
  },
};

export default productServices;
