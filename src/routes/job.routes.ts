import { Router } from "express";
import {
  requireAuthentication,
  requireRecruiter,
} from "../middlewares/auth.middleware";
import {
  createJobHandler,
  deleteJobHandler,
  getJobHandler,
} from "../controllers/job.controllers";
import validateResource from "../middlewares/validate-resouce";
import { jobSchema } from "../schema/job.schema";
import { idSchema } from "../schema/common.schema";

const router = Router();

router
  .post("/", requireRecruiter, validateResource(jobSchema), createJobHandler)
  .get("/", requireAuthentication, getJobHandler)
  .delete("/:id", requireRecruiter, validateResource(idSchema), deleteJobHandler);

export default router;
