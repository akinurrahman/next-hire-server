import { Request, Response } from "express";
import { createUser } from "../services/user.services";
import { CreateUserInput } from "../schema/user.schema";
import { omit } from "lodash";
import asyncHandler from "../utils/async-handler";
import { sendResponse } from "../utils/api-response";

export const createUserHandler = asyncHandler(
  async (req: Request<{}, {}, CreateUserInput>, res: Response) => {
    const user = await createUser(req.body);
    sendResponse(res, omit(user.toJSON(), "password"), "User created", 201);
  }
);
