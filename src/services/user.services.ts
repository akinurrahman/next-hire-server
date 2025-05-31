import UserModel from "../models/user.model";
import { CreateUserInput } from "../schema/user.schema";
import { ConflictError, InternalServerError } from "../utils/errors";

export const createUser = async (input: CreateUserInput) => {
  try {
    return await UserModel.create(input);
  } catch (error: any) {
    if (error.code === 11000) {
      throw new ConflictError("User already exists!");
    }
    throw new InternalServerError("Failed to create user");
  }
};
