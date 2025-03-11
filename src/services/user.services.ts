import { Role } from "../models/role.model";
import { User } from "../models/user.model";
import allMessages from "../utils/allMessages";
import { ApiError } from "../utils/ApiError";
import { statusCodes } from "../utils/statusCodes";
import { IRegisterInput } from "../validations/auth";
import bcrypt from "bcryptjs";

const userServices = {
  addAdminUser: async (body: IRegisterInput) => {
    const user = await User.findOne({ email: body.email });
    if (user) {
      throw new ApiError(
        statusCodes.BAD_REQUEST,
        allMessages.auth.userAllreadyExist
      );
    }
    const hashedPassword = await bcrypt.hash(body.password, 10);
    const newUser = new User({ ...body, password: hashedPassword });
    await newUser.save();
    const { password, ...sendUser } = newUser.toObject();
    return { user: sendUser };
  },
  getAdminUser: async (search: string, page: number, limit: number) => {
    const pageNumber = Math.max(1, Number(page));
    const limitNumber = Math.max(1, Number(limit));
    const filter: any = {};
    const clientRole = await Role.findOne({ name: "client" });
    if (clientRole) {
      filter.role = { $ne: clientRole?._id };
    }
    if (search) {
      filter.name = { $regex: search, $options: "i" };
    }
    const skip = (pageNumber - 1) * limitNumber;
    const [user, total] = await Promise.all([
      User.find(filter)
        .skip(skip)
        .limit(limitNumber)
        .populate({ path: "role", select: "name _id" }),
      User.countDocuments(filter),
    ]);
    const totalPages = Math.ceil(total / limitNumber);
    return { user, limit: limitNumber, page: pageNumber, total, totalPages };
  },
};

export default userServices;
