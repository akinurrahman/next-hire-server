import { CreateUserInput } from "../schema/user.schema";
import { hashOtp, hashPassword } from "../utils/hash";
import { generateOtp } from "../utils/otp";
import {
  createUnverifiedUser,
  ensureUnverifiedNotExists,
  ensureUserNotExists,
  sendVerificationOtp,
} from "../utils/user.helpers";

export const registerUser = async (input: CreateUserInput) => {
  await ensureUserNotExists(input.email);
  await ensureUnverifiedNotExists(input.email);

  const otp = generateOtp();
  const hash = hashOtp(otp.toString());

  const hashedPassword = await hashPassword(input.password);

  const newUnverifiedUser = await createUnverifiedUser(
    input,
    hashedPassword,
    hash
  );

  await sendVerificationOtp(input.email, otp);
  return newUnverifiedUser;
};
