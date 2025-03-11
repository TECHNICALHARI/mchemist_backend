import mongoose from "mongoose";
import { Brand } from "../models/brand.model";
import { fileType } from "../types/types";
import allMessages from "../utils/allMessages";
import { ApiError } from "../utils/ApiError";
import { uploadToCloudinary } from "../utils/cloudinary";
import { statusCodes } from "../utils/statusCodes";
import { brandTypes } from "../validations/product";

const brandServices = {
  addBrand: async (data: brandTypes, files: fileType) => {
    const { name } = data;
    const allreadyExists = await Brand.findOne({ name });
    if (allreadyExists) {
      throw new ApiError(
        statusCodes.BAD_REQUEST,
        allMessages.error.alreadyExists
      );
    }
    let icon = "";
    if (files.icon) {
      icon = await uploadToCloudinary(files.icon[0].buffer, "brand");
    }
    if (!icon) {
      throw new ApiError(
        statusCodes.BAD_REQUEST,
        allMessages.validation.iconRequired
      );
    }
    const brand = await Brand.create({ name, icon });
    return { _id: brand._id, name: brand.name, icon: brand.icon };
  },
  getBrand: async (search: string, page: number, limit: number) => {
    const pageNumber = Math.max(1, Number(page));
    const limitNumber = Math.max(1, Number(limit));
    const filter: any = {};
    if (search) {
      filter.name = { $regex: search, $options: "i" };
    }
    const [brand, total] = await Promise.all([
      Brand.find(filter)
        .skip((pageNumber - 1) * limitNumber)
        .limit(limitNumber)
        .select("name icon _id"),
      Brand.countDocuments(filter),
    ]);
    return { brand, total, page: pageNumber, limit: limitNumber };
  },
  updateBrand: async (data: brandTypes, files: fileType) => {
    const { name, id } = data;
    if (!id || !mongoose.Types.ObjectId.isValid(id)) {
      throw new ApiError(statusCodes.NOT_FOUND, allMessages.error.invalidId);
    }
    const brand = await Brand.findById(id);
    if (!brand) {
      throw new ApiError(statusCodes.BAD_REQUEST, allMessages.error.invalidId);
    }
    const existingBrand = await Brand.findOne({ name, _id: { $ne: id } });
    if (existingBrand) {
      throw new ApiError(
        statusCodes.BAD_REQUEST,
        allMessages.error.alreadyExists
      );
    }
    let icon = "";
    if (files.icon) {
      icon = await uploadToCloudinary(files.icon[0].buffer, "brand");
    }
    if (!icon) {
      throw new ApiError(
        statusCodes.BAD_REQUEST,
        allMessages.validation.iconRequired
      );
    }
    const updatedBrand = await Brand.findByIdAndUpdate(
      id,
      { name, icon },
      { new: true }
    ).select("name icon _id");
    return updatedBrand;
  },
  deleteBrand: async (id: string) => {
    const brand = await Brand.findByIdAndDelete(id).select("name icon _id");
    return brand;
  },
};

export default brandServices;
