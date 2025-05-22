import UserModel from "../models/user.model";
import { CreateUserInput } from "../schema/user.schema";

export const createUser = async (input: CreateUserInput) => {
  try {
    return await UserModel.create(input);
  } catch (error: any) {
    throw new Error(error);
  }
};
