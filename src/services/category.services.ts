import { Category } from "../models/category.model";
import allMessages from "../utils/allMessages";
import { ApiError } from "../utils/ApiError";
import { statusCodes } from "../utils/statusCodes";
import { categoryTypes } from "../validations/product";

const categoryServices = {
  multiAddCategory: async (data: categoryTypes[], userId: string) => {
    const categoryNames = data.map((category) => category.name);

    const existingCategories = await Category.find({
      name: { $in: categoryNames },
    });
    const existingCategoryNames = existingCategories.map(
      (category) => category.name
    );

    if (existingCategoryNames.length > 0) {
      throw new ApiError(
        statusCodes.BAD_REQUEST,
        `${allMessages.error.alreadyExists}: ${existingCategoryNames.join(
          ", "
        )}`
      );
    }
    const categoriesToInsert = data.map((category) => ({
      name: category.name,
      createdBy: userId
    }));
    const createdCategories = await Category.insertMany(categoriesToInsert);

    return createdCategories.map((category) => ({
      _id: category._id,
      name: category.name,
    }));
  },
  addCategory: async (data: categoryTypes) => {
    const { name } = data;
    const allreadyExists = await Category.findOne({ name });
    if (allreadyExists) {
      throw new ApiError(
        statusCodes.BAD_REQUEST,
        allMessages.error.alreadyExists
      );
    }
    const category = await Category.create({ name });
    return { _id: category._id, name: category.name };
  },
//   getCategory: async (search: string, page: number, limit: number) => {
//     const pageNumber = Math.max(1, Number(page));
//     const limitNumber = Math.max(1, Number(limit));
//     const filter: any = {};
//     if (search) {
//       filter.name = { $regex: search, $options: "i" };
//     }
//     const [category, total] = await Promise.all([
//       Category.find(filter)
//         .skip((pageNumber - 1) * limitNumber)
//         .limit(limitNumber)
//         .select("name icon _id"),
//       Category.countDocuments(filter),
//     ]);
//     return { category, total, page: pageNumber, limit: limitNumber };
//   },
//   updateCategory: async (data: categoryTypes, files: any) => {
//     const { name, id } = data;
//     const category = await Category.findById(id);
//     if (!category) {
//       throw new ApiError(statusCodes.NOT_FOUND, allMessages?.error.notFound);
//     }
//     const existingCategory = await Category.findOne({ name, _id: { $ne: id } });
//     if (existingCategory) {
//       throw new ApiError(
//         statusCodes.BAD_REQUEST,
//         allMessages.error.alreadyExists
//       );
//     }
//     let icon = "";
//     if (files.icon) {
//       icon = await uploadToCloudinary(files.icon[0].buffer, "category");
//     }
//     if (!icon) {
//       throw new ApiError(
//         statusCodes.BAD_REQUEST,
//         allMessages.validation.iconRequired
//       );
//     }
//     const updatedCategory = await Category.findByIdAndUpdate(
//       id,
//       {
//         name,
//         icon,
//       },
//       { new: true }
//     ).select("name icon _id");
//     return updatedCategory;
//   },
//   deleteCategory: async (id: string) => {
//     const category = await Category.findByIdAndDelete(id).select(
//       "name icon _id"
//     );
//     return category;
//   },
};

export default categoryServices;
