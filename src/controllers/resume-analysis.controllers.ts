import asyncHandler from "../utils/async-handler";
import { resumeAnalysisSchema } from "../schema/resume-analysis.schema";
import { BadRequestError } from "../utils/errors";
import { analyzeResumeAI, extractResumeText } from "../services/resume-analysis.services";


export const analyzeResumeHandler = asyncHandler(async (req, res) => {
  if (!req.file) {
    throw new BadRequestError("No file uploaded", {
      file: "Resume file is required",
    });
  }

  // Validate the uploaded file using our schema
  const validatedData = resumeAnalysisSchema.parse({ file: req.file });
  const { file } = validatedData;

  const resumeText = await extractResumeText(file);
  const analysis = await analyzeResumeAI(resumeText);

  res.status(200).json({
    success: true,
    message: "Resume analyzed successfully",
    data: JSON.parse(analysis || "[]"),
  });
});
