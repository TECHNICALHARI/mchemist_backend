import express from "express";
import { authMiddleware } from "../middlewares/auth.middleware";
import { requirePermission } from "../middlewares/permission.middleware";
import { PERMISSIONS } from "../utils/permissions";
import { addAdminUser, login, registerAdmin } from "../controllers/auth.controller";
import { asyncHandler } from "../middlewares/asyncHandler";

const adminRoutes = express.Router();
adminRoutes.post("/login", login);
adminRoutes.post("/register", registerAdmin);

adminRoutes.use(asyncHandler(authMiddleware));

adminRoutes.post("/add-user", requirePermission(PERMISSIONS.MANAGE_USERS), addAdminUser);
export default adminRoutes;
