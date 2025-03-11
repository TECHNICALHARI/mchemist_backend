// import { Category } from "../models/category.model";
// import allMessages from "../utils/allMessages";
// import { ApiError } from "../utils/ApiError";
// import { uploadToCloudinary } from "../utils/cloudinary";
// import { statusCodes } from "../utils/statusCodes";
// import { categoryTypes } from "../validations/product";

// const categoryServices = {
//   addCategory: async (data: categoryTypes, files: any) => {
//     const { name } = data;
//     const allreadyExists = await Category.findOne({ name });
//     if (allreadyExists) {
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
//     const category = await Category.create({ name, icon });
//     return { _id: category._id, name: category.name, icon: category.icon };
//   },
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
// };

// export default categoryServices;
