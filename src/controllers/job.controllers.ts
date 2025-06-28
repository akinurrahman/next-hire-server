import asyncHandler from "../utils/async-handler";
import { Request, Response } from "express";
import { CreateJobInput } from "../schema/job.schema";
import JobModel from "../models/job.model";
import { sendResponse } from "../utils/api-response";

export const createJobHandler = asyncHandler(
  async (req: Request<{}, {}, CreateJobInput>, res: Response) => {
    const newJob = await JobModel.create({
      ...req.body,
      postedBy: req.user?._id,
    });

    sendResponse(res, newJob, "Job created successfully", 201);
  }
);
