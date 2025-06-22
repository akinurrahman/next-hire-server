# Input Sanitization System

This document explains the global input sanitization system implemented in Next-Hire server application.

## Overview

The sanitization system provides comprehensive protection against:

- **XSS (Cross-Site Scripting)** attacks
- **SQL Injection** attempts
- **HTML/JavaScript injection**
- **Unicode normalization issues**
- **Excessive input length**

## How It Works

### Global Sanitization

The system automatically sanitizes all incoming requests (body, query parameters, URL parameters) before they reach your route handlers. This is configured in `src/app.ts`:

```typescript
// Global input sanitization middleware - applies to all routes
app.use(sanitizeInput(getSanitizationConfig()));
```

### Environment-Specific Configuration

The sanitization rules automatically adjust based on your environment:

- **Development**: Standard sanitization with reasonable limits
- **Production**: Stricter sanitization with tighter security
- **Test**: Lightweight sanitization for faster testing

## Sanitization Features

### 1. HTML Tag Removal

Removes all HTML tags from input strings:

```typescript
// Input: "<script>alert('xss')</script>Hello <b>World</b>"
// Output: "Hello World"
```

### 2. Script Removal

Removes JavaScript code and event handlers:

```typescript
// Input: "javascript:alert('xss') onclick='alert(1)'"
// Output: ""
```

### 3. HTML Escaping

Escapes HTML entities to prevent XSS:

```typescript
// Input: "<script>alert('xss')</script>"
// Output: "&lt;script&gt;alert('xss')&lt;/script&gt;"
```

### 4. Whitespace Normalization

Trims and normalizes whitespace:

```typescript
// Input: "  Hello    World  "
// Output: "Hello World"
```

### 5. Unicode Normalization

Normalizes Unicode characters to prevent encoding issues:

```typescript
// Input: "café" (with combining characters)
// Output: "café" (normalized)
```

### 6. Length Limiting

Prevents excessively long inputs:

```typescript
// Default max length: 10,000 characters
// Production max length: 5,000 characters
```

## Usage Examples

### Default Usage (Automatic)

All your existing routes automatically benefit from sanitization:

```typescript
// This route automatically gets sanitized input
router.post("/api/users", (req, res) => {
  const { name, email } = req.body; // Already sanitized!
  // Your business logic here
});
```

### Strict Sanitization

For sensitive operations, use stricter rules:

```typescript
router.post(
  "/admin/sensitive",
  sanitizeStrict(), // More restrictive sanitization
  (req, res) => {
    // Stricter rules applied
  }
);
```

### Lenient Sanitization

For content that may contain HTML (like rich text):

```typescript
router.post(
  "/content/article",
  sanitizeLenient(), // Allows HTML but removes scripts
  (req, res) => {
    // HTML content allowed, scripts removed
  }
);
```

### Selective Sanitization

Sanitize only specific fields:

```typescript
router.post(
  "/user/register",
  sanitizeSelective(
    ["email", "name"], // Only sanitize these body fields
    ["referral"], // Only sanitize this query param
    undefined, // Don't sanitize URL params
    FIELD_SANITIZATION_RULES.email // Use email-specific rules
  ),
  (req, res) => {
    // Only specified fields are sanitized
  }
);
```

### Custom Sanitization

Apply custom rules:

```typescript
router.post(
  "/api/custom",
  sanitizeInput({
    removeHtml: true,
    removeScripts: true,
    escapeHtml: true,
    trimWhitespace: true,
    normalizeUnicode: true,
    maxLength: 2000, // Custom length limit
  }),
  (req, res) => {
    // Custom rules applied
  }
);
```

## Field-Specific Rules

The system includes predefined rules for common field types:

```typescript
FIELD_SANITIZATION_RULES = {
  email: {
    maxLength: 254, // RFC 5321 limit
    removeHtml: true,
    escapeHtml: false, // Don't escape emails
  },
  password: {
    maxLength: 128,
    trimWhitespace: false, // Don't trim passwords
  },
  name: {
    maxLength: 100,
  },
  phone: {
    maxLength: 20,
  },
  url: {
    maxLength: 2048,
    escapeHtml: false, // Don't escape URLs
  },
};
```

## Configuration

### Environment-Based Configuration

The system automatically uses different rules based on your environment:

```typescript
// src/config/sanitization.ts
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
```

### Customizing Configuration

You can modify the configuration in `src/config/sanitization.ts`:

```typescript
export const DEFAULT_SANITIZATION_CONFIG: SanitizationOptions = {
  removeHtml: true,
  removeScripts: true,
  escapeHtml: true,
  trimWhitespace: true,
  normalizeUnicode: true,
  maxLength: 10000, // Adjust this value
};
```

## Error Handling

When sanitization fails, the system returns a 400 error:

```json
{
  "success": false,
  "message": "Invalid input data",
  "error": "Sanitization failed"
}
```

## Best Practices

### 1. Trust the Global Sanitization

The global sanitization is designed to be safe for most use cases. Don't disable it unless absolutely necessary.

### 2. Use Field-Specific Rules

For sensitive fields like emails, passwords, or URLs, use the predefined field-specific rules.

### 3. Test Your Sanitization

When adding new routes, test with malicious input to ensure proper sanitization:

```typescript
// Test cases to try:
const maliciousInputs = [
  "<script>alert('xss')</script>",
  "javascript:alert('xss')",
  "'; DROP TABLE users; --",
  "onclick='alert(1)'",
  "data:text/html,<script>alert('xss')</script>",
];
```

### 4. Monitor Sanitization Errors

Log sanitization failures to identify potential attacks:

```typescript
// In your error handler, log sanitization failures
if (error.message.includes("Sanitization failed")) {
  logger.warn("Sanitization failed", {
    path: req.path,
    ip: req.ip,
    userAgent: req.get("User-Agent"),
  });
}
```

### 5. Don't Rely Solely on Sanitization

Sanitization is one layer of security. Always combine it with:

- Input validation (Zod schemas)
- Authentication and authorization
- Rate limiting
- HTTPS
- Proper error handling

## Migration Guide

### For Existing Routes

Your existing routes automatically benefit from sanitization. No changes needed!

### For New Routes

1. Use the global sanitization (automatic)
2. Add specific sanitization only when needed
3. Test with malicious input

### For Special Cases

If you need to handle raw data (file uploads, webhooks, etc.):

```typescript
// Option 1: Use selective sanitization
router.post(
  "/webhook",
  sanitizeSelective([], [], []), // Don't sanitize anything
  (req, res) => {
    // Handle raw data
  }
);

// Option 2: Implement your own validation
router.post("/file-upload", (req, res) => {
  // Implement file-specific validation
});
```

## Troubleshooting

### Common Issues

1. **Valid HTML being removed**: Use `sanitizeLenient()` for content that should contain HTML
2. **Passwords being trimmed**: Use `FIELD_SANITIZATION_RULES.password`
3. **URLs being escaped**: Use `FIELD_SANITIZATION_RULES.url`
4. **Input too long**: Adjust `maxLength` in configuration

### Debugging

To debug sanitization issues, temporarily log the before/after values:

```typescript
router.post("/debug", (req, res) => {
  console.log("Original:", req.body);
  // Sanitization happens automatically
  console.log("Sanitized:", req.body);
  res.json({ message: "Debug info logged" });
});
```

## Security Considerations

- The sanitization system is designed to be secure by default
- It prevents common attack vectors but doesn't replace proper validation
- Always validate business logic separately from sanitization
- Keep the sanitization rules updated as new attack vectors emerge
- Monitor and log sanitization failures for security insights
