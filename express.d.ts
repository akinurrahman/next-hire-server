import { UserDocument } from "./src/interfaces/auth.interface";

declare global {
  namespace Express {
    interface Request {
      user?: UserDocument; 
    }
  }
}
