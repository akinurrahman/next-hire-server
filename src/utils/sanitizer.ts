import { escape } from "lodash";

/**
 * Sanitization utility for cleaning user inputs
 * Provides protection against XSS, SQL injection, and other injection attacks
 */

export interface SanitizationOptions {
  removeHtml?: boolean;
  removeScripts?: boolean;
  escapeHtml?: boolean;
  trimWhitespace?: boolean;
  normalizeUnicode?: boolean;
  maxLength?: number;
}

export const DEFAULT_SANITIZATION_OPTIONS: SanitizationOptions = {
  removeHtml: true,
  removeScripts: true,
  escapeHtml: true,
  trimWhitespace: true,
  normalizeUnicode: true,
  maxLength: 10000,
};

/**
 * Removes HTML tags from a string
 */
export const removeHtmlTags = (input: string): string => {
  return input.replace(/<[^>]*>/g, "");
};

/**
 * Removes script tags and JavaScript code
 */
export const removeScripts = (input: string): string => {
  return input
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, "")
    .replace(/javascript:/gi, "")
    .replace(/on\w+\s*=/gi, "")
    .replace(/data:text\/html/gi, "");
};

/**
 * Escapes HTML entities
 */
export const escapeHtml = (input: string): string => {
  return escape(input);
};

/**
 * Trims whitespace and normalizes spaces
 */
export const trimWhitespace = (input: string): string => {
  return input.trim().replace(/\s+/g, " ");
};

/**
 * Normalizes Unicode characters
 */
export const normalizeUnicode = (input: string): string => {
  return input.normalize("NFKC");
};

/**
 * Limits string length
 */
export const limitLength = (input: string, maxLength: number): string => {
  return input.length > maxLength ? input.substring(0, maxLength) : input;
};

/**
 * Sanitizes a string value with the given options
 */
export const sanitizeString = (
  input: string,
  options: SanitizationOptions = DEFAULT_SANITIZATION_OPTIONS
): string => {
  if (typeof input !== "string") {
    return input;
  }

  let sanitized = input;

  if (options.removeScripts !== false) {
    sanitized = removeScripts(sanitized);
  }

  if (options.removeHtml !== false) {
    sanitized = removeHtmlTags(sanitized);
  }

  if (options.escapeHtml !== false) {
    sanitized = escapeHtml(sanitized);
  }

  if (options.trimWhitespace !== false) {
    sanitized = trimWhitespace(sanitized);
  }

  if (options.normalizeUnicode !== false) {
    sanitized = normalizeUnicode(sanitized);
  }

  if (options.maxLength) {
    sanitized = limitLength(sanitized, options.maxLength);
  }

  return sanitized;
};

/**
 * Sanitizes an object recursively
 */
export const sanitizeObject = (
  obj: any,
  options: SanitizationOptions = DEFAULT_SANITIZATION_OPTIONS
): any => {
  if (obj === null || obj === undefined) {
    return obj;
  }

  if (typeof obj === "string") {
    return sanitizeString(obj, options);
  }

  if (typeof obj === "number" || typeof obj === "boolean") {
    return obj;
  }

  if (Array.isArray(obj)) {
    return obj.map((item) => sanitizeObject(item, options));
  }

  if (typeof obj === "object") {
    const sanitized: any = {};
    for (const [key, value] of Object.entries(obj)) {
      sanitized[key] = sanitizeObject(value, options);
    }
    return sanitized;
  }

  return obj;
};

/**
 * Sanitizes email addresses
 */
export const sanitizeEmail = (email: string): string => {
  if (typeof email !== "string") {
    return email;
  }

  // Basic email validation and sanitization
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const sanitized = email.toLowerCase().trim();

  if (!emailRegex.test(sanitized)) {
    throw new Error("Invalid email format");
  }

  return sanitized;
};

/**
 * Sanitizes phone numbers
 */
export const sanitizePhone = (phone: string): string => {
  if (typeof phone !== "string") {
    return phone;
  }

  // Remove all non-digit characters except + for international numbers
  const sanitized = phone.replace(/[^\d+]/g, "");

  if (sanitized.length < 7 || sanitized.length > 15) {
    throw new Error("Invalid phone number length");
  }

  return sanitized;
};

/**
 * Sanitizes URLs
 */
export const sanitizeUrl = (url: string): string => {
  if (typeof url !== "string") {
    return url;
  }

  const sanitized = url.trim();

  // Basic URL validation
  try {
    new URL(sanitized);
    return sanitized;
  } catch {
    throw new Error("Invalid URL format");
  }
};

/**
 * Sanitizes numeric values
 */
export const sanitizeNumber = (value: any): number => {
  if (typeof value === "number") {
    return value;
  }

  if (typeof value === "string") {
    const parsed = parseFloat(value);
    if (isNaN(parsed)) {
      throw new Error("Invalid number format");
    }
    return parsed;
  }

  throw new Error("Value must be a number or numeric string");
};

/**
 * Sanitizes boolean values
 */
export const sanitizeBoolean = (value: any): boolean => {
  if (typeof value === "boolean") {
    return value;
  }

  if (typeof value === "string") {
    const lower = value.toLowerCase();
    if (lower === "true" || lower === "1" || lower === "yes") {
      return true;
    }
    if (lower === "false" || lower === "0" || lower === "no") {
      return false;
    }
  }

  if (typeof value === "number") {
    return value !== 0;
  }

  throw new Error("Value must be a boolean or boolean-like string");
};
