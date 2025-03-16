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
import twilio from "twilio";
import { appConfig } from "../config/config";
import { generateOTP } from "../utils/otpUtils";
import { Otp } from "../models/otp.model";

const client = twilio(
  appConfig.TWILIO_ACCOUNT_SID,
  appConfig.TWILIO_AUTH_TOKEN
);

const authServices = {
  initiateRegistration: async (body: IUserRegisterInput) => {
    const { name, phone, email, password } = body;
    const existingUser = await User.findOne({$or: [{phone}, {email}]});
    if (existingUser) {
      if (existingUser.email === email) {
        throw new ApiError(statusCodes.BAD_REQUEST, "User already exists with this email");
      }
      if (existingUser.phone === phone) {
        throw new ApiError(statusCodes.BAD_REQUEST, "User already exists with this phone number");
      }
    }

    const tempUser = { name, phone, email, password };

    const otp = await generateOTP(phone);

    await client.messages.create({
      body: `Your OTP for registration is: ${otp}`,
      from: appConfig.TWILIO_PHONE_NUMBER,
      to: phone,
    });
    console.log(otp, "otp");
    return { success: true, message: "OTP sent successfully", tempUser };
  },
  verifyAndRegister: async (body: IUserRegisterInput) => {
    const { name, phone, email, password, otp } = body;

    const otpRecord = await Otp.findOne({ userId: phone }).sort({
      createdAt: -1,
    });

    if (!otpRecord || otpRecord.otp !== otp) {
      throw new ApiError(statusCodes.BAD_REQUEST, "Invalid or expired OTP");
    }

    if (otpRecord.expiresAt < new Date()) {
      throw new ApiError(statusCodes.BAD_REQUEST, "OTP has expired");
    }

    const existingUser = await User.findOne({ phone });
    if (existingUser) {
      throw new ApiError(
        statusCodes.BAD_REQUEST,
        "User already exists with this phone number"
      );
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const clientRole = await Role.findOne({ name: "client" });
    if (!clientRole) {
      throw new ApiError(
        statusCodes.INTERNAL_SERVER_ERROR,
        "Default role 'client' not found."
      );
    }
    const newUser = new User({
      name,
      phone,
      email,
      password: hashedPassword,
      role: clientRole._id,
    });
    await newUser.save();
    await Otp.deleteMany({ userId: phone });

    return { user: newUser };
  },

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
    const { password, role, ...sendUser } = newUser.toObject();
    return { user: sendUser };
  },
  Login: async (body: ILoginInput) => {
    const user = await User.findOne({ email: body.email })
      .populate<{ role: IRole }>("role")
      .lean();

    if (!user || !(await bcrypt.compare(body.password, user.password))) {
      throw new ApiError(
        statusCodes.UNAUTHORIZED,
        allMessages.auth.loginFailed
      );
    }

    const token = generateToken({
      id: (user._id as Types.ObjectId).toString(),
      role: user.role.name,
    });

    const { password, role, ...sendUser } = user;
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
    const newUser = new User({
      ...body,
      password: hashedPassword,
      role: adminRole?._id,
    });
    await newUser.save();
    const { password, ...sendUser } = newUser.toObject();
    return { user: sendUser };
  },
};

export default authServices;
