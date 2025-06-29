import { z } from "zod";

export const paginationSchema = z.object({
  query: z
    .object({
      page: z
        .string()
        .optional()
        .refine((val) => !val || (!isNaN(Number(val)) && Number(val) > 0), {
          message: "Page must be a positive number",
        }),
      limit: z
        .string()
        .optional()
        .refine(
          (val) =>
            !val ||
            (!isNaN(Number(val)) && Number(val) > 0 && Number(val) <= 100),
          { message: "Limit must be a positive number not exceeding 100" }
        ),
      sortBy: z.string().optional(),
      sortOrder: z.enum(["asc", "desc"]).optional(),
    })
    .optional(),
});
