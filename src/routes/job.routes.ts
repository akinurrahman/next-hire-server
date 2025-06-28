import { Router } from "express";
import {
  requireAuthentication,
  requireRecruiter,
} from "../middlewares/auth.middleware";
import {
  createJobHandler,
  getJobHandler,
} from "../controllers/job.controllers";
import validateResource from "../middlewares/validate-resouce";
import { jobSchema } from "../schema/job.schema";

const router = Router();

router
  .post("/", requireRecruiter, validateResource(jobSchema), createJobHandler)
  .get("/", requireAuthentication, getJobHandler);

export default router;
