import { Response } from "express";
import { IUser, User } from "../models/user.model";
import {
  ILoginInput,
  IRegisterInput,
  IUserRegisterInput,
} from "../validations/auth";
import bcrypt from "bcryptjs";
import { generateToken } from "../utils/auth.utils";
import allMessages from "../utils/allMessages";
import { ApiError } from "../utils/ApiError";
import { statusCodes } from "../utils/statusCodes";
import { IRole, Role } from "../models/role.model";
import { Types } from "mongoose";

const authServices = {
  register: async (body: IUserRegisterInput) => {
    const user = await User.findOne({ email: body.email });
    if (user) {
      throw new ApiError(
        statusCodes.BAD_REQUEST,
        allMessages.auth.userAllreadyExist
      );
    }
    const clientRole = await Role.findOne({ name: "client" });
    if (!clientRole) {
      throw new ApiError(
        statusCodes.INTERNAL_SERVER_ERROR,
        "Default role 'client' not found."
      );
    }
    const hashedPassword = await bcrypt.hash(body.password, 10);
    const newUser = new User({
      ...body,
      password: hashedPassword,
      role: clientRole._id,
    });
    await newUser.save();
    const { password,role, ...sendUser } = newUser.toObject();
    return { user: sendUser };
  },

  Login: async (body: ILoginInput) => {
    const user = await User.findOne({ email: body.email })
      .populate<{ role: IRole }>("role")
      .lean();

    if (!user || !(await bcrypt.compare(body.password, user.password))) {
      throw new ApiError(statusCodes.UNAUTHORIZED, allMessages.auth.loginFailed);
    }

    const token = generateToken({
      id: (user._id as Types.ObjectId).toString(),
      role: user.role.name,
    });

    const { password,role,  ...sendUser } = user;
    return { user: sendUser, token };
  },

  registerAdmin: async (body: IRegisterInput) => {
    const user = await User.findOne({ email: body.email, phone: body.phone });
    if (user) {
      throw new ApiError(
        statusCodes.BAD_REQUEST,
        allMessages.auth.userAllreadyExist
      );
    }
    const adminRole = await Role.findOne({ name: "admin" });
    if (!adminRole) {
      throw new ApiError(
        statusCodes.INTERNAL_SERVER_ERROR,
        "Default role 'admin' not found."
      );
    }
    const hashedPassword = await bcrypt.hash(body.password, 10);
    console.log(adminRole, "adminRole")
    const newUser = new User({ ...body, password: hashedPassword, role: adminRole?._id });
    await newUser.save();
    const { password, ...sendUser } = newUser.toObject();
    return { user: sendUser };
  },
};

export default authServices;
