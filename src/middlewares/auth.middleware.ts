import { Request, Response, NextFunction } from "express";
import { verifyToken } from "../utils/jwt";
import { UnauthorizedError } from "../utils/errors";
import UserModel from "../models/auth/user.model";

interface AuthenticatedRequest extends Request {
  user?: any;
}

export const authenticateToken = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      throw new UnauthorizedError(
        "Authorization header required",
        "AUTHORIZATION_HEADER_REQUIRED"
      );
    }

    // Check if it's a Bearer token
    if (!authHeader.startsWith("Bearer ")) {
      throw new UnauthorizedError(
        "Bearer token required",
        "BEARER_TOKEN_REQUIRED"
      );
    }

    const token = authHeader.split(" ")[1]; // Extract token after "Bearer "

    if (!token) {
      throw new UnauthorizedError(
        "Access token required",
        "ACCESS_TOKEN_REQUIRED"
      );
    }

    const payload = verifyToken(token);
    const user = await UserModel.findById(payload.userId).select("-password");

    if (!user) {
      throw new UnauthorizedError("User not found", "USER_NOT_FOUND");
    }

    req.user = user;
    next();
  } catch (error) {
    next(new UnauthorizedError("Invalid access token", "INVALID_ACCESS_TOKEN"));
  }
};
