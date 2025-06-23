# Input Sanitization & Security Guide

## Overview

This document outlines the sanitization and security measures implemented in the Next-Hire server application to protect against common web vulnerabilities while supporting rich text content.

## Architecture

### Global Sanitization Middleware

- **Location**: `src/middlewares/sanitization.middleware.ts`
- **Purpose**: Provides base-level sanitization for all incoming requests
- **Scope**: Automatically sanitizes query parameters and URL parameters
- **Rich Text Support**: Identifies and preserves rich text fields

### Schema-Level Validation

- **Location**: `src/schema/` directory
- **Purpose**: Type-safe validation and sanitization using Zod
- **Features**:
  - Input transformation (trim, normalize)
  - Rich text validation
  - Type inference for TypeScript

## Security Measures

### 1. Input Sanitization

#### Regular Fields

- **HTML Escaping**: All regular string inputs are escaped to prevent XSS
- **Whitespace Trimming**: Removes leading/trailing whitespace
- **Length Validation**: Enforces minimum and maximum lengths

#### Rich Text Fields

- **Allowed HTML Tags**: `p`, `br`, `strong`, `b`, `em`, `i`, `u`, `h1`, `h2`, `h3`, `h4`, `h5`, `h6`, `ul`, `ol`, `li`, `blockquote`, `code`, `pre`, `span`, `div`, `a`, `img`
- **Blocked Tags**: `script`, `iframe`, `object`, `embed`, `form`, `input`, `button`, `select`, `textarea`, `style`, `link`, `meta`
- **Protocol Filtering**: Blocks `javascript:`, `data:`, `vbscript:` protocols
- **Event Handler Removal**: Strips `on*` attributes

### 2. Field Identification

The system automatically identifies rich text fields based on field names:

```typescript
const richTextFields = [
  "description",
  "content",
  "bio",
  "about",
  "summary",
  "details",
  "message",
  "comment",
  "notes",
  "requirements",
  "responsibilities",
];
```

### 3. Request Size Limits

- **JSON Payload**: 10MB limit
- **URL Encoded**: 10MB limit
- **Purpose**: Prevents large payload attacks

## Implementation Details

### Middleware Chain

```typescript
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));
app.use(sanitizationMiddleware);
app.use("/", requestLogger, baseRouter);
```

### Schema Example

```typescript
export const createUserSchema = z.object({
  body: z.object({
    fullName: z
      .string()
      .min(1, "Name cannot be empty")
      .transform(sanitizeString),
    email: z.string().email("Not a valid email").transform(sanitizeEmail),
    bio: z
      .string()
      .optional()
      .transform((val) => (val ? sanitizeRichText(val) : val))
      .pipe(richTextValidator.optional()),
  }),
});
```

## Usage Examples

### 1. Regular Text Field

```typescript
// Input: "<script>alert('xss')</script>Hello"
// Output: "&lt;script&gt;alert('xss')&lt;/script&gt;Hello"
```

### 2. Rich Text Field

```typescript
// Input: "<p>Hello <strong>World</strong></p><script>alert('xss')</script>"
// Output: "<p>Hello <strong>World</strong></p>"
// Note: Safe HTML preserved, dangerous content removed
```

### 3. Email Normalization

```typescript
// Input: "  USER@EXAMPLE.COM  "
// Output: "user@example.com"
```

## Security Best Practices

### 1. Always Validate Input

- Use Zod schemas for all endpoints
- Never trust user input
- Validate both structure and content

### 2. Rich Text Guidelines

- Only allow necessary HTML tags
- Validate all attributes
- Block dangerous protocols
- Consider using a dedicated rich text editor

### 3. Output Encoding

- Always encode output when rendering user content
- Use appropriate encoding for different contexts (HTML, JSON, etc.)

### 4. Regular Updates

- Keep dependencies updated
- Monitor security advisories
- Regularly review and update sanitization rules

## Testing

### Manual Testing

```bash
# Test XSS protection
curl -X POST http://localhost:3000/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{"fullName": "<script>alert(\"xss\")</script>", "email": "test@example.com", "password": "password123", "confirmPassword": "password123", "role": "candidate"}'

# Test rich text support
curl -X POST http://localhost:3000/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{"fullName": "John Doe", "email": "test@example.com", "password": "password123", "confirmPassword": "password123", "role": "candidate", "bio": "<p>Hello <strong>World</strong></p>"}'
```

### Automated Testing

Create test cases for:

- XSS prevention
- Rich text preservation
- Input validation
- Edge cases

## Troubleshooting

### Common Issues

1. **Rich text not working**

   - Check if field name is in `richTextFields` array
   - Verify HTML tags are in `ALLOWED_HTML_TAGS`

2. **Validation errors**

   - Review Zod schema configuration
   - Check transformation functions

3. **Performance issues**
   - Monitor middleware execution time
   - Consider caching for repeated validations

## Future Enhancements

1. **Rate Limiting**: Implement request rate limiting
2. **Helmet.js**: Add comprehensive security headers
3. **Content Security Policy**: Implement CSP headers
4. **File Upload Security**: Add file type and size validation
5. **Advanced Rich Text**: Integrate with dedicated rich text editors

## References

- [OWASP XSS Prevention](https://owasp.org/www-project-cheat-sheets/cheatsheets/Cross_Site_Scripting_Prevention_Cheat_Sheet.html)
- [Zod Documentation](https://zod.dev/)
- [Express.js Security Best Practices](https://expressjs.com/en/advanced/best-practices-security.html)
