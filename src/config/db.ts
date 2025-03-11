import mongoose from "mongoose";
import { appConfig } from "./config";
import dotenv from "dotenv";
import { seedRoles } from "../utils/roleSeeder";

dotenv.config();

const connectDB = async () => {
  try {
    mongoose.connect(appConfig.MONGO_URI!);
    await seedRoles();
    console.log("MongoDB Connected");
  } catch (error) {
    console.error("MongoDB Connection Failed:", error);
    process.exit(1);
  }
};

export default connectDB;
