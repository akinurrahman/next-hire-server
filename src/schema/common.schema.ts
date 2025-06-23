import { z } from "zod";

export const sanitizeEmail = (email: string) => email.toLowerCase().trim();
export const sanitizeString = (str: string) => str.trim();

export const sanitizedString = (message: string) =>
  z.string({ required_error: message }).transform(sanitizeString);

export const emailSchema = z
  .string({ required_error: "Email is required" })
  .email("Not a valid email")
  .transform(sanitizeEmail);

