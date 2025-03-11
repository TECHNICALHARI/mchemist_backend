import express from "express";
import { authMiddleware } from "../middlewares/auth.middleware";
import { requirePermission } from "../middlewares/permission.middleware";
import { PERMISSIONS } from "../utils/permissions";
import { login, registerAdmin } from "../controllers/auth.controller";
import { asyncHandler } from "../middlewares/asyncHandler";
import { addAdminUser, getAdminUser } from "../controllers/user.controller";

const adminRoutes = express.Router();
adminRoutes.post("/login", login);
adminRoutes.post("/register", registerAdmin);

adminRoutes.use(asyncHandler(authMiddleware));

adminRoutes.post("/user", requirePermission(PERMISSIONS.MANAGE_USERS), addAdminUser);
adminRoutes.get("/user", requirePermission(PERMISSIONS.MANAGE_USERS), getAdminUser);
export default adminRoutes;
