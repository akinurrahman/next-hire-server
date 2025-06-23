/**
 * Sanitization utilities for different contexts
 */

export const sanitizeForDatabase = (value: any): any => {
  if (typeof value === "string") {
    return value
      .trim()
      .replace(/[<>]/g, "") // Remove potential HTML tags
      .replace(/javascript:/gi, "") // Remove javascript: protocol
      .replace(/data:/gi, ""); // Remove data: protocol
  }
  return value;
};

export const sanitizeForOutput = (value: any): any => {
  if (typeof value === "string") {
    return value
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#x27;");
  }
  return value;
};

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

export const validateRichText = (value: string): boolean => {
  const disallowedTags =
    /<(script|iframe|object|embed|form|input|button|select|textarea|style|link|meta)(\s[^>]*)?>/gi;
  const dangerousProtocols = /javascript:|data:|vbscript:/gi;

  return !disallowedTags.test(value) && !dangerousProtocols.test(value);
};
