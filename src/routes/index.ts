import express from "express";
import adminRoutes from "./admin.routes";
import userRoutes from "./user.routes";

const router = express.Router();

router.use("/admin", adminRoutes);
router.use("/", userRoutes);

export default router;
