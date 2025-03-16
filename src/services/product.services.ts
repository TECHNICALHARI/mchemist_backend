import mongoose from "mongoose";
import { ProductInputTypes, productSchema } from "../validations/product";
import { Product } from "../models/product.model";
import { ApiError } from "../utils/ApiError";
import { statusCodes } from "../utils/statusCodes";
import allMessages from "../utils/allMessages";
import { ICategory } from "../models/category.model";

const productServices = {
  addManyProduct: async (
    data: ProductInputTypes[],
    userId: mongoose.Types.ObjectId
  ) => {
    const productName = data.map((item) => item.name);
    const existingProductName = await Product.find({
      name: { $in: productName },
    });

    if (existingProductName.length > 0) {
      throw new ApiError(
        statusCodes.BAD_REQUEST,
        `${allMessages.error.alreadyExists}: ${existingProductName
          .map((item) => item.name)
          .join(", ")}`
      );
    }

    const parsedData = data.map((item) => ({
      ...item,
      createdBy: userId,
    }));

    const products = await Product.insertMany(parsedData);
    const sendProduct = products.map(({ name, category, price }) => ({
      name,
      category,
      price,
    }));
    return sendProduct;
  },
  addProduct: async (
    data: ProductInputTypes,
    userId: mongoose.Types.ObjectId
  ) => {
    const allreadyExist = await Product.findOne({ name: data.name });
    if (allreadyExist) {
      throw new ApiError(
        statusCodes.BAD_REQUEST,
        allMessages.error.alreadyExists
      );
    }
    const parsedData = {
      ...data,
      createdBy: userId,
    };
    const validatedData = productSchema.parse(parsedData);
    const product = await Product.create(validatedData);
    const { createdBy, ...sendProduct } = product.toObject();
    return sendProduct;
  },
  getProduct: async (search: string, limit: number, page: number) => {
    const pageNumber = Math.max(1, Number(page));
    const limitNumber = Math.max(1, Number(limit));
    const filter: any = {};
    if (search) {
      filter.name = { $regex: search, $options: "i" };
    }
    const skip = (pageNumber - 1) * limitNumber;
    const [products, count] = await Promise.all([
      Product.find(filter)
        .skip(skip)
        .limit(limitNumber)
        .select("name category price _id")
        .populate({ path: "category", select: "name" }),
      Product.countDocuments(filter),
    ]);

    const formattedProducts = products.map((product) => {
      const categoryName = (product.category as ICategory)?.name || null;
      return {
        ...product.toObject(),
        category: categoryName,
      };
    });
    return {
      product: formattedProducts,
      limit: limitNumber,
      page: pageNumber,
      total: count,
    };
  },
};

export default productServices;
