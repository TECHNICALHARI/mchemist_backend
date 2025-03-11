import express, { NextFunction, Request, Response } from "express";
import cors from "cors";
import { corsOptions } from "./config/security";
import connectDB from "./config/db";
import router from "./routes";
import { errorHandler } from "./middlewares/errorHandler";
const app = express();

app.use(cors(corsOptions));
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ limit: "10mb", extended: true }));

connectDB();

app.use("/api", router);

app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  errorHandler(err, req, res, next);
});

export default app;
