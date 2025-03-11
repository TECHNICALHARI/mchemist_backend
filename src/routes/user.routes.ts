import express from "express";
import { authMiddleware } from "../middlewares/auth.middleware";
import { login, registerUser } from "../controllers/auth.controller";
// import { getProducts } from "../controllers/product.controller";
// import { placeOrder, viewOrders } from "../controllers/order.controller";

const clientRoutes = express.Router();

// ✅ Public Route (Anyone can access without login)
// clientRoutes.get("/products", getProducts);
clientRoutes.post("/register", registerUser);
clientRoutes.post("/login", login);

// ✅ Private Routes (Clients must be logged in)
clientRoutes.use((req, res, next) => {
  authMiddleware(req as any, res, next).catch(next);
});
// clientRoutes.post("/orders", placeOrder);
// clientRoutes.get("/orders", viewOrders);

export default clientRoutes;
