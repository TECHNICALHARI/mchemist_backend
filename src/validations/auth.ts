import z from "zod";
import { PERMISSIONS } from "../utils/permissions";

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});
// const PermissionEnum = z.enum([
//   ...Object.values(PERMISSIONS) as [typeof PERMISSIONS[keyof typeof PERMISSIONS], ...typeof PERMISSIONS[keyof typeof PERMISSIONS][]]
// ]);
export const registerAdminSchema = z.object({
  name: z.string().min(3),
  email: z.string().email(),
  password: z.string().min(8),
  // role: z.string(),
  phone: z
    .string()
    .regex(/^\+?[1-9]\d{1,14}$/, "Invalid phone number format")
    .min(10, "Phone number must be at least 10 digits long")
    .max(15, "Phone number must be at most 15 digits long"),
});
export const userRegisterSchema = z.object({
  name: z.string().min(3),
  email: z.string().email(),
  password: z.string().min(8),
  phone: z
    .string()
    .regex(/^\+?[1-9]\d{1,14}$/, "Invalid phone number format")
    .min(10, "Phone number must be at least 10 digits long")
    .max(15, "Phone number must be at most 15 digits long"),
});

export type ILoginInput = z.infer<typeof loginSchema>;
export type IRegisterInput = z.infer<typeof registerAdminSchema>;
export type IUserRegisterInput = z.infer<typeof userRegisterSchema>;
