import { appConfig } from "./config";

export const corsOptions = {
    origin: appConfig.CORS_ORIGIN || "http://localhost:3005",
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  };
  
  export const rateLimitOptions = {
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // Limit each IP to 100 requests per windowMs
  };