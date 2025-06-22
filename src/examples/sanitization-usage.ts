import { Router } from "express";
import {
  sanitizeInput,
  sanitizeSelective,
  sanitizeStrict,
  sanitizeLenient,
} from "../middlewares/sanitize-input";
import { FIELD_SANITIZATION_RULES } from "../config/sanitization";

const router = Router();

/**
 * Example 1: Route with default sanitization (already applied globally)
 * This route will use the global sanitization middleware
 */
router.post("/user/profile", (req, res) => {
  // req.body, req.query, and req.params are already sanitized
  const { name, email, bio } = req.body;

  // Your business logic here
  res.json({ message: "Profile updated", data: { name, email, bio } });
});

/**
 * Example 2: Route with strict sanitization for sensitive operations
 */
router.post(
  "/admin/sensitive-operation",
  sanitizeStrict(), // Override global sanitization with stricter rules
  (req, res) => {
    // This route has stricter sanitization (shorter maxLength, etc.)
    res.json({ message: "Sensitive operation completed" });
  }
);

/**
 * Example 3: Route with lenient sanitization for content that may contain HTML
 */
router.post(
  "/content/article",
  sanitizeLenient(), // Allow HTML content but still remove scripts
  (req, res) => {
    // This route allows HTML content (useful for rich text editors)
    const { title, content } = req.body;
    res.json({ message: "Article saved", data: { title, content } });
  }
);

/**
 * Example 4: Route with selective sanitization for specific fields
 */
router.post(
  "/user/registration",
  sanitizeSelective(
    ["email", "name", "phone"], // Sanitize these body fields
    ["referral"], // Sanitize this query parameter
    undefined, // Don't sanitize any URL params
    FIELD_SANITIZATION_RULES.email // Use email-specific rules
  ),
  (req, res) => {
    // Only specified fields are sanitized with specific rules
    const { email, name, phone } = req.body;
    const referral = req.query.referral;

    res.json({
      message: "Registration successful",
      data: { email, name, phone, referral },
    });
  }
);

/**
 * Example 5: Route with custom sanitization options
 */
router.post(
  "/api/custom-endpoint",
  sanitizeInput({
    removeHtml: true,
    removeScripts: true,
    escapeHtml: true,
    trimWhitespace: true,
    normalizeUnicode: true,
    maxLength: 2000, // Custom length limit
  }),
  (req, res) => {
    // Custom sanitization rules applied
    res.json({ message: "Custom endpoint processed" });
  }
);

/**
 * Example 6: Route that bypasses global sanitization for specific needs
 * (Use with caution - only when you have specific requirements)
 */
router.post(
  "/api/raw-data",
  // No sanitization middleware - handles raw data
  (req, res) => {
    // This route receives unsanitized data
    // You should implement your own validation/sanitization here
    res.json({ message: "Raw data received" });
  }
);

export default router;
