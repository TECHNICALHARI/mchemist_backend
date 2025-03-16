import mongoose, { model, Schema } from "mongoose";

export interface ICategory extends Document {
  name: string;
  createdBy: mongoose.Types.ObjectId;
}

const categorySchema = new Schema<ICategory>({
  name: { type: String, required: true },
  createdBy: { type: Schema.ObjectId, ref: "User", required: true },
});

export const Category = model<ICategory>("Category", categorySchema);
