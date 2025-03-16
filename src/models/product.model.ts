import mongoose, { model, Schema } from "mongoose";
import { ICategory } from "./category.model";
export interface IProduct extends Document {
  name: string;
  price: number;
  category: ICategory | mongoose.Types.ObjectId;
  createdBy: mongoose.Types.ObjectId;
}
const productSchema = new Schema<IProduct>({
  name: { type: String, required: true },
  price: { type: Number, required: true },
  category: { type: mongoose.Schema.Types.ObjectId, ref: "Category", required: true },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
}, {timestamps: true, versionKey: false});

export const Product = model<IProduct>("Product", productSchema);
