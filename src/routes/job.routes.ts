import { Router } from "express";
import { requireRecruiter } from "../middlewares/auth.middleware";
import { createJobHandler } from "../controllers/job.controllers";
import validateResource from "../middlewares/validate-resouce";
import { jobSchema } from "../schema/job.schema";

const router = Router();

router.post(
  "/",
  requireRecruiter,
  validateResource(jobSchema),
  createJobHandler
);

export default router;
