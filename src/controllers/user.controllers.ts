import { Request, Response } from "express";
import {
  loginUser,
  registerUser,
  resendOtp,
  verifyOtp,
  refreshToken,
} from "../services/user.services";
import {
  CreateUserInput,
  LoginInput,
  ResendOtpInput,
  VerifyOtpInput,
  RefreshTokenInput,
} from "../schema/user.schema";
import asyncHandler from "../utils/async-handler";
import { sendResponse } from "../utils/api-response";
import { omit } from "lodash";

export const createUserHandler = asyncHandler(
  async (req: Request<{}, {}, CreateUserInput>, res: Response) => {
    const unverifiedUser = await registerUser(req.body);
    const safeUser = omit(unverifiedUser.toJSON(), "password", "otpHash");
    sendResponse(res, safeUser, "OTP sent to email", 200);
  }
);

export const verifyOtpHandler = asyncHandler(
  async (req: Request<{}, {}, VerifyOtpInput>, res: Response) => {
    const { email, otp } = req.body;
    const { user, accessToken, refreshToken } = await verifyOtp(email, otp);

    const responseData = {
      user: omit(user.toJSON(), "password"),
      accessToken,
      refreshToken,
    };

    sendResponse(res, responseData, "OTP verified successfully", 200);
  }
);

export const resendOtpHandler = asyncHandler(
  async (req: Request<{}, {}, ResendOtpInput>, res: Response) => {
    const { email } = req.body;

    const unverifiedUser = await resendOtp(email);
    sendResponse(
      res,
      omit(unverifiedUser.toJSON(), "otpHash", "password"),
      "OTP resent successfully",
      200
    );
  }
);

export const loginHandler = asyncHandler(
  async (req: Request<{}, {}, LoginInput>, res: Response) => {
    const { email, password } = req.body;
    const {
      user,
      accessToken,
      refreshToken: newRefreshToken,
    } = await loginUser(email, password);

    const responseData = {
      user: omit(user.toJSON(), "password"),
      accessToken,
      refreshToken: newRefreshToken,
    };

    sendResponse(res, responseData, "Login successful", 200);
  }
);

export const refreshTokenHandler = asyncHandler(
  async (req: Request<{}, {}, RefreshTokenInput>, res: Response) => {
    const { refreshToken: token } = req.body;
    const {
      user,
      accessToken,
      refreshToken: newRefreshToken,
    } = await refreshToken(token);

    const responseData = {
      user: omit(user.toJSON(), "password"),
      accessToken,
      refreshToken: newRefreshToken,
    };

    sendResponse(res, responseData, "Token refreshed successfully", 200);
  }
);
