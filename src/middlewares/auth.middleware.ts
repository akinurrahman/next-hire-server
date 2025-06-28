import { Request, Response, NextFunction } from "express";
import { verifyToken } from "../utils/jwt";
import { UnauthorizedError, ForbiddenError } from "../utils/errors";
import UserModel from "../models/auth/user.model";
import { ROLES } from "../constants";

interface AuthenticatedRequest extends Request {
  user?: any;
}

export const requireAuth = (...allowedRoles: string[]) => {
  return async (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
  ) => {
    try {
      // Step 1: Authenticate token
      const authHeader = req.headers.authorization;
      if (!authHeader) {
        throw new UnauthorizedError(
          "Authorization header required",
          "AUTHORIZATION_HEADER_REQUIRED"
        );
      }

      if (!authHeader.startsWith("Bearer ")) {
        throw new UnauthorizedError(
          "Bearer token required",
          "BEARER_TOKEN_REQUIRED"
        );
      }

      const token = authHeader.split(" ")[1];
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

      // Step 2: Check roles (if any specified)
      if (allowedRoles.length > 0) {
        const userRole = user.role;

        if (!userRole || !allowedRoles.includes(userRole)) {
          throw new ForbiddenError(
            `Access denied. Required roles: ${allowedRoles.join(", ")}`,
            "INSUFFICIENT_PERMISSIONS"
          );
        }
      }

      next();
    } catch (error) {
      if (
        error instanceof UnauthorizedError ||
        error instanceof ForbiddenError
      ) {
        next(error);
      } else {
        next(
          new UnauthorizedError("Invalid access token", "INVALID_ACCESS_TOKEN")
        );
      }
    }
  };
};

// Convenience middlewares using the new combined approach
export const requireAdmin = requireAuth(ROLES.ADMIN);
export const requireRecruiter = requireAuth(ROLES.RECRUITER);
export const requireCandidate = requireAuth(ROLES.CANDIDATE);
export const requireRecruiterOrAdmin = requireAuth(
  ROLES.RECRUITER,
  ROLES.ADMIN
);

// For routes that just need authentication without role checking
export const requireAuthentication = requireAuth();
