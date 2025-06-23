import { z } from "zod";
import { ROLES } from "../constants";
import { emailSchema, sanitizeString } from "./common.schema";

export const createUserSchema = z.object({
  body: z
    .object({
      fullName: z
        .string({
          required_error: "Name is required",
        })
        .min(1, "Name cannot be empty")
        .transform(sanitizeString),
      password: z
        .string({
          required_error: "Password is required",
        })
        .min(6, "min 6 char is required"),
      confirmPassword: z.string({
        required_error: "Confirm password is required",
      }),
      email: emailSchema,
      role: z.enum([ROLES.CANDIDATE, ROLES.RECRUITER], {
        required_error: "Role is required",
        invalid_type_error: "Role must be either candidate or recruiter",
      }),
    })
    .refine((data) => data.password === data.confirmPassword, {
      message: "Password do not match",
      path: ["confirmPassword"],
    }),
});

export const verifyOtpSchema = z.object({
  body: z.object({
    email: emailSchema,
    otp: z.string({ required_error: "OTP is required" }),
  }),
});

export const resendOtpSchema = z.object({
  body: z.object({
    email: emailSchema,
  }),
});

export const loginSchema = z.object({
  body: z.object({
    email: emailSchema,
    password: z.string({ required_error: "Password is required" }),
  }),
});

export const refreshTokenSchema = z.object({
  body: z.object({
    refreshToken: z.string({ required_error: "Refresh token is required" }),
  }),
});

export const forgotPasswordSchema = z.object({
  body: z.object({
    email: emailSchema,
  }),
});

export const resetPasswordSchema = z.object({
  body: z
    .object({
      token: z.string({ required_error: "Token is required" }),
      password: z.string({ required_error: "Password is required" }),
      confirmPassword: z.string({
        required_error: "Confirm password is required",
      }),
    })
    .refine((data) => data.password === data.confirmPassword, {
      message: "Password do not match",
      path: ["confirmPassword"],
    }),
});

export type CreateUserInput = Omit<
  z.infer<typeof createUserSchema>["body"],
  "confirmPassword"
>;
export type VerifyOtpInput = z.infer<typeof verifyOtpSchema>["body"];
export type ResendOtpInput = z.infer<typeof resendOtpSchema>["body"];
export type LoginInput = z.infer<typeof loginSchema>["body"];
export type RefreshTokenInput = z.infer<typeof refreshTokenSchema>["body"];
export type ForgotPasswordInput = z.infer<typeof forgotPasswordSchema>["body"];
export type ResetPasswordInput = Omit<
  z.infer<typeof resetPasswordSchema>["body"],
  "confirmPassword"
>;
