import { z } from "zod";
import {
  isoDateString,
  sanitizedString,
  sanitizeString,
} from "./common.schema";
import { sanitizeRichText } from "../utils/sanitization";

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
  startDate: isoDateString("Start date is required"),
  endDate: isoDateString().optional(),
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
  currency: z.string(),
});

const salarySchema = z.union([fixedSalarySchema, negotiableSalarySchema]);

export const jobSchema = z.object({
  body: z.object({
    title: z
      .string({ required_error: "Job Title is required" })
      .min(1, "Job Title cannot be empty")
      .transform(sanitizeString),
    description: z
      .string()
      .transform((val) => (val ? sanitizeRichText(val) : val)),
    type: z.enum(["full-time", "part-time", "freelance", "remote", "hybrid"], {
      required_error: "Type is required",
    }),
    education: z.object({
      name: sanitizedString("Education name is required"),
      startDate: isoDateString("Start date is required"),
      endDate: isoDateString().optional(),
      isCurrent: z.boolean({ required_error: "Is current is required" }),
    }),
    experience: experieceSchema,
    skills: z
      .array(sanitizedString("Skill is required"))
      .transform((skills) => skills.map(sanitizeString)),

    salary: salarySchema,
    location: z
      .string({ required_error: "Location is required" })
      .min(1, "Location cannot be empty")
      .transform(sanitizeString),
    status: z
      .enum(["active", "inactive", "draft"], {
        required_error: "Status is required",
      })
      .optional(),
    company: z
      .string({ required_error: "Company name is required" })
      .min(1, "Company name cannot be empty")
      .transform(sanitizeString),
    applicationDeadline: isoDateString().optional(),
  }),
});

export type CreateJobInput = z.infer<typeof jobSchema>["body"];
