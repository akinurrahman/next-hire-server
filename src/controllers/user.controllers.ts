import { Request, Response } from "express";
import { registerUser } from "../services/user.services";
import { CreateUserInput } from "../schema/user.schema";
import asyncHandler from "../utils/async-handler";
import { sendResponse } from "../utils/api-response";
import { omit } from "lodash";

export const createUserHandler = asyncHandler(
  async (req: Request<{}, {}, CreateUserInput>, res: Response) => {
    const unverifiedUser = await registerUser(req.body);
    const safeUser = omit(unverifiedUser.toJSON(),"password","otpHash")
    sendResponse(res, safeUser, "OTP sent to email", 200);
  }
);
