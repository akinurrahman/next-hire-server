import { Request, Response } from "express";
import logger from "../utils/logger";
import { createUser } from "../services/user.services";
import { CreateUserInput } from "../schema/user.schema";
import { omit } from "lodash";

export const createUserHandler = async (
  req: Request<{}, {}, CreateUserInput>,
  res: Response
) => {
  try {
    const response = await createUser(req.body);
    res.status(201).json(omit(response.toJSON(), "password"));
  } catch (error: any) {
    logger.error(error);
    res.status(401).send(error.message);
  }
};
