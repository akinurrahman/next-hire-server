import { SanitizationOptions } from "../utils/sanitizer";

/**
 * Sanitization configuration for different environments and use cases
 */

// Default sanitization options for most routes
export const DEFAULT_SANITIZATION_CONFIG: SanitizationOptions = {
  removeHtml: true,
  removeScripts: true,
  escapeHtml: true,
  trimWhitespace: true,
  normalizeUnicode: true,
  maxLength: 10000,
};

// Strict sanitization for sensitive operations
export const STRICT_SANITIZATION_CONFIG: SanitizationOptions = {
  removeHtml: true,
  removeScripts: true,
  escapeHtml: true,
  trimWhitespace: true,
  normalizeUnicode: true,
  maxLength: 5000,
};

// Lenient sanitization for content that may contain HTML
export const LENIENT_SANITIZATION_CONFIG: SanitizationOptions = {
  removeHtml: false,
  removeScripts: true,
  escapeHtml: false,
  trimWhitespace: true,
  normalizeUnicode: true,
  maxLength: 50000,
};

// Sanitization config for user input fields
export const USER_INPUT_SANITIZATION_CONFIG: SanitizationOptions = {
  removeHtml: true,
  removeScripts: true,
  escapeHtml: true,
  trimWhitespace: true,
  normalizeUnicode: true,
  maxLength: 1000,
};

// Sanitization config for email content
export const EMAIL_SANITIZATION_CONFIG: SanitizationOptions = {
  removeHtml: false,
  removeScripts: true,
  escapeHtml: false,
  trimWhitespace: true,
  normalizeUnicode: true,
  maxLength: 100000,
};

// Environment-specific configurations
export const getSanitizationConfig = (): SanitizationOptions => {
  const env = process.env.NODE_ENV || "development";

  switch (env) {
    case "production":
      return STRICT_SANITIZATION_CONFIG;
    case "development":
      return DEFAULT_SANITIZATION_CONFIG;
    case "test":
      return {
        ...DEFAULT_SANITIZATION_CONFIG,
        maxLength: 1000, // Shorter for tests
      };
    default:
      return DEFAULT_SANITIZATION_CONFIG;
  }
};

// Field-specific sanitization rules
export const FIELD_SANITIZATION_RULES = {
  email: {
    removeHtml: true,
    removeScripts: true,
    escapeHtml: false,
    trimWhitespace: true,
    normalizeUnicode: true,
    maxLength: 254, // RFC 5321 limit
  },
  password: {
    removeHtml: true,
    removeScripts: true,
    escapeHtml: true,
    trimWhitespace: false, // Don't trim passwords
    normalizeUnicode: true,
    maxLength: 128,
  },
  name: {
    removeHtml: true,
    removeScripts: true,
    escapeHtml: true,
    trimWhitespace: true,
    normalizeUnicode: true,
    maxLength: 100,
  },
  phone: {
    removeHtml: true,
    removeScripts: true,
    escapeHtml: true,
    trimWhitespace: true,
    normalizeUnicode: true,
    maxLength: 20,
  },
  url: {
    removeHtml: true,
    removeScripts: true,
    escapeHtml: false,
    trimWhitespace: true,
    normalizeUnicode: true,
    maxLength: 2048,
  },
} as const;
