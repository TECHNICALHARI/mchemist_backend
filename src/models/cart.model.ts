import mongoose from "mongoose";

export interface ICart extends Document{
    userId: mongoose.Types.ObjectId;
    
}