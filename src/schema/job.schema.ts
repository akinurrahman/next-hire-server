import { z } from "zod";
import { sanitizedString, sanitizeString } from "./common.schema";
import { richTextValidator, sanitizeRichText } from "../utils/sanitization";

const noExperienceSchema = z.object({
  type: z.literal("no-experience"),
});

const experienceDetailSchema = z.object({
  type: z.enum(["1-3 years", "3-5 years", "5-10 years", "10+ years"]),
  company: z
    .string({ required_error: "Company name is required" })
    .transform(sanitizeString),
  location: z
    .string({ required_error: "Location is required" })
    .transform(sanitizeString),
  role: z
    .string({ required_error: "Role is required" })
    .transform(sanitizeString),
  description: z
    .string({ required_error: "Description is required" })
    .transform(sanitizeString)
    .optional(),
  startDate: z.date({ required_error: "Start date is required" }),
  endDate: z.date().optional(),
  isCurrent: z.boolean(),
  noticePeriod: z.number(),
});

const experieceSchema = z.union([noExperienceSchema, experienceDetailSchema]);

const fixedSalarySchema = z.object({
  type: z.literal("fixed"),
  amount: z.number().min(0),
  currency: z.string(),
});

const negotiableSalarySchema = z.object({
  type: z.literal("negotiable"),
  min: z.number().min(0),
  max: z.number().min(0),
});

const salarySchema = z.union([fixedSalarySchema, negotiableSalarySchema]);

export const jobSchema = z.object({
  body: z.object({
    title: sanitizedString("Job Title is required"),
    description: sanitizedString("Job Description is required")
      .transform((val) => (val ? sanitizeRichText(val) : val))
      .pipe(richTextValidator.optional()),
    type: z.enum(["full-time", "part-time", "freelance", "remote", "hybrid"], {
      required_error: "Type is required",
    }),
    education: z.object({
      name: sanitizedString("Education name is required"),
      startDate: z.date({ required_error: "Start date is required" }),
      endDate: z.date().optional(),
      isCurrent: z.boolean({ required_error: "Is current is required" }),
    }),
    experience: experieceSchema,
    skills: z
      .array(sanitizedString("Skill is required"))
      .transform((skills) => skills.map(sanitizeString)),

    salary: salarySchema,
    location: sanitizedString("Location is required"),
  }),
});

export type JobInput = z.infer<typeof jobSchema>["body"];
