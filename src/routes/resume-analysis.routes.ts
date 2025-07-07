import { Router } from "express";
import * as resumeAnalysisController from "../controllers/resume-analysis.controllers";
import { uploadResume } from "../middlewares/upload.middleware";

const router = Router();

router.post(
  "/resume-analysis",
  uploadResume.single("resume"),
  resumeAnalysisController.analyzeResumeHandler
);

export default router;
