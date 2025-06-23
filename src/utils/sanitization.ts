import { z } from "zod";

export const sanitizeRichText = (value: string): string => {
  // Remove dangerous tags and attributes while preserving safe HTML
  return value
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, "")
    .replace(/<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi, "")
    .replace(/<object\b[^<]*(?:(?!<\/object>)<[^<]*)*<\/object>/gi, "")
    .replace(/<embed\b[^<]*(?:(?!<\/embed>)<[^<]*)*<\/embed>/gi, "")
    .replace(/javascript:/gi, "")
    .replace(/on\w+\s*=/gi, "") // Remove event handlers
    .trim();
};

const disallowedTags =
  /<(script|iframe|object|embed|form|input|button|select|textarea|style|link|meta)(\s[^>]*)?>/gi;

export const validateRichText = (value: string): boolean => {
  const dangerousProtocols = /javascript:|data:|vbscript:/gi;
  return !disallowedTags.test(value) && !dangerousProtocols.test(value);
};

export const richTextValidator = z.string().refine(
  (value) => {
    if (disallowedTags.test(value)) {
      return false;
    }
    if (/javascript:/gi.test(value)) {
      return false;
    }
    return true;
  },
  {
    message: "Bio contains disallowed HTML tags or unsafe content",
  }
);