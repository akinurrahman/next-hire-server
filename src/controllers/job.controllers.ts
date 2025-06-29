import asyncHandler from "../utils/async-handler";
import { Request, Response } from "express";
import { CreateJobInput } from "../schema/job.schema";
import JobModel from "../models/job.model";
import { sendResponse, sendPaginatedResponse } from "../utils/api-response";
import { getJobs } from "../services/job.services";

export const createJobHandler = asyncHandler(
  async (req: Request<{}, {}, CreateJobInput>, res: Response) => {
    const newJob = await JobModel.create({
      ...req.body,
      postedBy: req.user?._id,
    });

    sendResponse(res, newJob, "Job created successfully", 201);
  }
);

export const getJobHandler = asyncHandler(
  async (req: Request, res: Response) => {
    const paginatedResult = await getJobs(req.query);

    sendPaginatedResponse(
      res,
      paginatedResult,
      req.query.search
        ? "Search results fetched successfully"
        : "Jobs fetched successfully",
      200
    );
  }
);
