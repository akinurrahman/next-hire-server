import unVerifiedUserModel from "../models/auth/unverified-user.model";
import { sendEmail } from "./mail";
import { ConflictError, UnauthorizedError } from "./errors";
import { CreateUserInput } from "../schema/user.schema";
import { generateOtpVerificationEmail } from "../templates/otp-verification-email";
import UserModel from "../models/auth/user.model";

export const ensureUserNotExists = async (email: string) => {
  const user = await UserModel.findOne({ email });
  if (user) throw new ConflictError("User already exists!");
};

export const ensureUnverifiedNotExists = async (email: string) => {
  const unverifiedUser = await unVerifiedUserModel.findOne({ email });
  if (unverifiedUser) {
    throw new UnauthorizedError(
      "account already exists, but not verified",
      "EMAIL_NOT_VERIFIED"
    );
  }
};

export const createUnverifiedUser = async (
  input: CreateUserInput,
  hashedPassword: string,
  otpHash: string
) => {
  return await unVerifiedUserModel.create({
    fullName: input.fullName,
    email: input.email,
    password: hashedPassword,
    role: input.role,
    otpHash,
    otpExpiresAt: new Date(Date.now() + 1000 * 60 * 10),
  });
};

export const sendVerificationOtp = async (email: string, otp: number) => {
  const { text, html } = generateOtpVerificationEmail(otp);
  await sendEmail({
    to: email,
    subject: "OTP for verification",
    text,
    html,
  });
};
