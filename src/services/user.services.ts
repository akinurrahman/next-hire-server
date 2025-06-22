import unVerifiedUserModel from "../models/auth/unverified-user.model";
import UserModel from "../models/auth/user.model";
import { CreateUserInput } from "../schema/user.schema";
import { UnauthorizedError } from "../utils/errors";
import {
  compareOtp,
  comparePassword,
  hashOtp,
  hashPassword,
} from "../utils/hash";
import { generateOtp } from "../utils/otp";
import {
  generateResetPasswordToken,
  generateTokens,
  verifyRefreshToken,
  verifyResetPasswordToken,
} from "../utils/jwt";
import {
  createUnverifiedUser,
  ensureUnverifiedNotExists,
  ensureUserNotExists,
  sendVerificationOtp,
} from "../utils/user.helpers";
import ResetToken from "../models/auth/reset-token.model";
import { sendResetPasswordOtp } from "../templates/reset-password-token";
import { sendEmail } from "../utils/mail";

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

export const verifyOtp = async (email: string, otp: string) => {
  const unverifiedUser = await unVerifiedUserModel.findOne({ email });
  if (!unverifiedUser)
    throw new UnauthorizedError("account not found", "ACCOUNT_NOT_FOUND");

  if (unverifiedUser.otpExpiresAt < new Date())
    throw new UnauthorizedError("otp expired", "OTP_EXPIRED");

  const isOtpValid = compareOtp(otp, unverifiedUser.otpHash);
  if (!isOtpValid) throw new UnauthorizedError("invalid otp", "INVALID_OTP");

  const user = await UserModel.create({
    fullName: unverifiedUser.fullName,
    email: unverifiedUser.email,
    password: unverifiedUser.password,
    role: unverifiedUser.role,
  });

  await unVerifiedUserModel.deleteOne({ email });

  const tokens = generateTokens({
    userId: user._id.toString(),
    email: user.email,
  });

  return {
    user,
    ...tokens,
  };
};

export const resendOtp = async (email: string) => {
  const unverifiedUser = await unVerifiedUserModel.findOne({ email });
  if (!unverifiedUser)
    throw new UnauthorizedError(
      "This email is either already verified or not registered",
      "EMAIL_NOT_ELIGIBLE_FOR_OTP"
    );

  const otp = generateOtp();
  const hashedOtp = hashOtp(otp.toString());

  await unVerifiedUserModel.updateOne(
    { email },
    { $set: { otpHash: hashedOtp } }
  );
  await sendVerificationOtp(email, otp);

  return unverifiedUser;
};

export const loginUser = async (email: string, password: string) => {
  const user = await UserModel.findOne({ email });

  const isPasswordCorrect =
    user && (await comparePassword(password, user.password));
  if (!user || !isPasswordCorrect)
    throw new UnauthorizedError(
      "Invalid email or password",
      "INVALID_CREDIENTIALS"
    );

  const tokens = generateTokens({
    userId: user._id.toString(),
    email: user.email,
  });

  return {
    user,
    ...tokens,
  };
};

export const refreshToken = async (refreshToken: string) => {
  try {
    const payload = verifyRefreshToken(refreshToken);
    const user = await UserModel.findById(payload.userId);

    if (!user) {
      throw new UnauthorizedError("User not found", "USER_NOT_FOUND");
    }

    const tokens = generateTokens({
      userId: user._id.toString(),
      email: user.email,
    });

    return {
      user,
      ...tokens,
    };
  } catch (error) {
    throw new UnauthorizedError(
      "Invalid refresh token",
      "INVALID_REFRESH_TOKEN"
    );
  }
};

export const forgotPassword = async (email: string) => {
  const user = await UserModel.findOne({ email });
  if (!user) throw new UnauthorizedError("User not found", "USER_NOT_FOUND");

  const resetToken = await ResetToken.create({
    email,
    token: generateResetPasswordToken(email),
    expiresAt: new Date(Date.now() + 1000 * 60 * 10),
  });

  await sendEmail({
    to: email,
    subject: "Reset Password",
    html: sendResetPasswordOtp({
      token: resetToken.token,
      fullName: user.fullName,
    }),
  });
};

export const resetPassword = async (token: string, password: string) => {
  const { email } = verifyResetPasswordToken(token);
  const user = await UserModel.findOne({ email });
  if (!user) throw new UnauthorizedError("User not found", "USER_NOT_FOUND");

  const hashedPassword = await hashPassword(password);
  await UserModel.updateOne({ email }, { $set: { password: hashedPassword } });
};
