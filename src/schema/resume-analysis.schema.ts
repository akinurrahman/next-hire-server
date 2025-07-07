import { z } from "zod";

export const resumeAnalysisSchema = z.object({
  file: z.object({
    fieldname: z.string(),
    originalname: z.string(),
    encoding: z.string(),
    mimetype: z.enum(
      [
        "application/pdf",
        "application/msword",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        "text/plain",
      ],
      {
        required_error: "File type must be PDF, DOC, DOCX, or TXT",
      }
    ),
    size: z.number().max(10 * 1024 * 1024, "File size must be less than 10MB"),
    buffer: z.instanceof(Buffer),
  }),
});

export type ResumeAnalysis = z.infer<typeof resumeAnalysisSchema>;
