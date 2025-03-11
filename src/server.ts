import { JwtPayload } from "jsonwebtoken";
import app from "./app";
import { appConfig } from "./config/config";

declare global {
  namespace Express {
    export interface Request {
      user?: JwtPayload | any;
    }
  }
}
const PORT = appConfig.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});