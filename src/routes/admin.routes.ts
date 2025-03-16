import express from "express";
import { authMiddleware } from "../middlewares/auth.middleware";
import { requirePermission } from "../middlewares/permission.middleware";
import { PERMISSIONS } from "../utils/permissions";
import { initiateRegistration, login, registerAdmin, verifyAndRegister } from "../controllers/auth.controller";
import { asyncHandler } from "../middlewares/asyncHandler";
import { addAdminUser, getAdminUser } from "../controllers/user.controller";
import { addMultiProduct, addProduct, getProduct } from "../controllers/product.controller";
import { addCategoryMany } from "../controllers/category.controller";

const adminRoutes = express.Router();
adminRoutes.post("/login", login);
// adminRoutes.post("/register", registerAdmin);
adminRoutes.post("/send-otp", initiateRegistration);
adminRoutes.post("/register", verifyAndRegister);

adminRoutes.use(asyncHandler(authMiddleware));

adminRoutes.post("/user", requirePermission(PERMISSIONS.MANAGE_USERS), addAdminUser);
adminRoutes.get("/user", requirePermission(PERMISSIONS.MANAGE_USERS), getAdminUser);
adminRoutes.post("/multi-category", requirePermission(PERMISSIONS.manage_products), addCategoryMany);
adminRoutes.post("/multi-product", requirePermission(PERMISSIONS.manage_products), addMultiProduct);
adminRoutes.post("/product", requirePermission(PERMISSIONS.manage_products), addProduct);
adminRoutes.get("/product", requirePermission(PERMISSIONS.manage_products), getProduct);
export default adminRoutes;
