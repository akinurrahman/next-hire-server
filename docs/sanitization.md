# Sanitization Guide

This document outlines the sanitization practices and utilities used throughout the Next-Hire server application to ensure data security and prevent common web vulnerabilities.

## Table of Contents

- [Overview](#overview)
- [Sanitization Middleware](#sanitization-middleware)
- [Rich Text Sanitization](#rich-text-sanitization)
- [Input Validation with Zod](#input-validation-with-zod)
- [Common Sanitization Functions](#common-sanitization-functions)
- [Security Best Practices](#security-best-practices)
- [Usage Examples](#usage-examples)

## Overview

The application implements a multi-layered approach to data sanitization:

1. **Global Middleware**: Automatically sanitizes all incoming requests
2. **Rich Text Sanitization**: Specialized handling for HTML content
3. **Schema Validation**: Zod-based validation with built-in sanitization
4. **Common Utilities**: Reusable sanitization functions

## Sanitization Middleware

### Location: `src/middlewares/sanitization.middleware.ts`

The global sanitization middleware automatically processes all incoming requests and sanitizes:

- Request body
- Query parameters
- URL parameters

#### Features:

- Uses Lodash's `escape()` function to prevent XSS attacks
- Trims whitespace from string values
- Recursively processes nested objects and arrays
- Adds sanitized data to request object as `sanitizedBody`, `sanitizedQuery`, and `sanitizedParams`

#### Usage:

```typescript
// Middleware is automatically applied in app.ts
app.use(sanitizationMiddleware);

// Access sanitized data in route handlers
app.post("/example", (req: SanitizedRequest, res) => {
  const cleanData = req.sanitizedBody;
  // Process sanitized data
});
```

## Rich Text Sanitization

### Location: `src/utils/sanitization.ts`

Specialized sanitization for HTML content, particularly user-generated content like bios and descriptions.

#### Functions:

##### `sanitizeRichText(value: string): string`

Removes dangerous HTML tags and attributes while preserving safe content:

- **Removed Tags**: `<script>`, `<iframe>`, `<object>`, `<embed>`
- **Removed Attributes**: Event handlers (`onclick`, `onload`, etc.)
- **Removed Protocols**: `javascript:`, `data:`, `vbscript:`

##### `validateRichText(value: string): boolean`

Validates that content doesn't contain dangerous elements.

##### `richTextValidator`

Zod schema for rich text validation with custom error messages.

#### Usage:

```typescript
import { sanitizeRichText, richTextValidator } from "../utils/sanitization";

// Sanitize user input
const userBio = '<script>alert("xss")</script>Hello World';
const sanitizedBio = sanitizeRichText(userBio);
// Result: "Hello World"

// Use in Zod schema
const bioSchema = z
  .string()
  .transform(sanitizeRichText)
  .pipe(richTextValidator);
```

## Input Validation with Zod

### Location: `src/schema/`

Zod schemas provide both validation and sanitization through transforms.

#### Common Sanitization Functions:

##### `sanitizeEmail(email: string): string`

- Converts to lowercase
- Trims whitespace

##### `sanitizeString(str: string): string`

- Trims leading and trailing whitespace

#### Example Schema:

```typescript
// src/schema/common.schema.ts
export const emailSchema = z
  .string({ required_error: "Email is required" })
  .email("Not a valid email")
  .transform(sanitizeEmail);

// src/schema/user.schema.ts
export const createUserSchema = z.object({
  body: z.object({
    fullName: z
      .string({ required_error: "Name is required" })
      .min(1, "Name cannot be empty")
      .transform(sanitizeString),
    email: emailSchema,
    // ... other fields
  }),
});
```

## Common Sanitization Functions

### String Sanitization

- **Trimming**: Remove leading/trailing whitespace
- **Case Normalization**: Convert emails to lowercase
- **HTML Escaping**: Prevent XSS attacks using Lodash escape

### HTML Content Sanitization

- **Tag Removal**: Remove dangerous HTML tags
- **Attribute Filtering**: Remove event handlers and dangerous protocols
- **Content Validation**: Ensure no malicious content remains

## Security Best Practices

### 1. Always Sanitize User Input

```typescript
// ❌ Bad - Direct use of user input
app.post("/user", (req, res) => {
  const userData = req.body; // Unsafe
});

// ✅ Good - Use sanitized data
app.post("/user", (req: SanitizedRequest, res) => {
  const userData = req.sanitizedBody; // Safe
});
```

### 2. Validate Before Sanitizing

```typescript
// ✅ Good - Validate structure first, then sanitize
const userSchema = z.object({
  name: z.string().min(1).transform(sanitizeString),
  email: z.string().email().transform(sanitizeEmail),
});
```

### 3. Use Rich Text Sanitization for HTML Content

```typescript
// ✅ Good - For user-generated HTML content
const bio = sanitizeRichText(userInput);
const isValid = validateRichText(bio);
```

### 4. Implement Defense in Depth

- Global middleware for basic sanitization
- Schema-level validation and sanitization
- Specialized sanitization for specific content types
- Output encoding when rendering content

## Usage Examples

### Basic Route with Sanitization

```typescript
import { Router } from "express";
import { sanitizeRichText } from "../utils/sanitization";
import validateResource from "../middlewares/validate-resource";
import { createUserSchema } from "../schema/user.schema";

const router = Router();

router.post(
  "/register",
  validateResource(createUserSchema),
  (req: SanitizedRequest, res) => {
    // Data is already sanitized by middleware and schema
    const userData = req.sanitizedBody;
    // Process user registration
  }
);

router.post("/profile", (req: SanitizedRequest, res) => {
  const { bio } = req.body;
  const sanitizedBio = sanitizeRichText(bio);

  // Validate the sanitized content
  if (!validateRichText(sanitizedBio)) {
    return res.status(400).json({ error: "Invalid content" });
  }

  // Save sanitized bio
});
```

### Schema with Rich Text Validation

```typescript
import { z } from "zod";
import { richTextValidator } from "../utils/sanitization";

const profileSchema = z.object({
  body: z.object({
    bio: z
      .string()
      .optional()
      .transform((val) => (val ? sanitizeRichText(val) : val))
      .pipe(richTextValidator.optional()),
  }),
});
```

## Security Considerations

### XSS Prevention

- All user input is HTML-escaped by default
- Rich text content is filtered for dangerous tags
- Event handlers are removed from HTML content

### Injection Prevention

- Input validation prevents malformed data
- Schema validation ensures data structure integrity
- Database queries use parameterized statements (handled by Mongoose)

### Content Security

- File upload limits (10MB max payload)
- Input length restrictions through Zod schemas
- Protocol filtering for rich text content

## Testing Sanitization

### Unit Tests

```typescript
import { sanitizeRichText, validateRichText } from "../utils/sanitization";

describe("Sanitization", () => {
  test("should remove script tags", () => {
    const input = '<script>alert("xss")</script>Hello';
    const result = sanitizeRichText(input);
    expect(result).toBe("Hello");
  });

  test("should validate safe content", () => {
    const input = "<p>Safe content</p>";
    const isValid = validateRichText(input);
    expect(isValid).toBe(true);
  });
});
```

## Maintenance

### Regular Updates

- Keep dependencies updated (especially security-related packages)
- Review and update disallowed tags list as needed
- Monitor for new attack vectors and update sanitization rules

### Monitoring

- Log sanitization failures for analysis
- Monitor for patterns in malicious input
- Regular security audits of sanitization logic

---

**Note**: This sanitization system is designed to work with the existing Express.js middleware stack and Zod validation system. Always test thoroughly when making changes to sanitization logic.
