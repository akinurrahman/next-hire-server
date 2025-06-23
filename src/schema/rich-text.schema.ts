import { z } from "zod";

// Custom validator for rich text content
const richTextValidator = z
  .string()
  .min(1, "Content cannot be empty")
  .max(10000, "Content too long")
  .refine(
    (value) => {
      // Basic HTML tag validation - check for disallowed tags
      const disallowedTags =
        /<(script|iframe|object|embed|form|input|button|select|textarea|style|link|meta)(\s[^>]*)?>/gi;

      // Check for disallowed tags
      if (disallowedTags.test(value)) {
        return false;
      }

      // Check for javascript: protocol in href/src attributes
      if (/javascript:/gi.test(value)) {
        return false;
      }

      return true;
    },
    {
      message: "Content contains disallowed HTML tags or unsafe content",
    }
  );

export const richTextSchema = z.object({
  content: richTextValidator,
});

export const jobDescriptionSchema = z.object({
  title: z.string().min(1, "Title is required").max(100),
  description: z
    .string()
    .min(10, "Description must be at least 10 characters")
    .max(5000, "Description too long")
    .refine(
      (value) => {
        // Basic HTML tag validation - check for disallowed tags
        const disallowedTags =
          /<(script|iframe|object|embed|form|input|button|select|textarea|style|link|meta)(\s[^>]*)?>/gi;

        // Check for disallowed tags
        if (disallowedTags.test(value)) {
          return false;
        }

        // Check for javascript: protocol in href/src attributes
        if (/javascript:/gi.test(value)) {
          return false;
        }

        return true;
      },
      {
        message: "Content contains disallowed HTML tags or unsafe content",
      }
    ),
  requirements: richTextValidator.optional(),
  responsibilities: richTextValidator.optional(),
});

export type RichTextInput = z.infer<typeof richTextSchema>;
export type JobDescriptionInput = z.infer<typeof jobDescriptionSchema>;
