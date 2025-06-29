import asyncHandler from "../utils/async-handler";
import { Request, Response } from "express";
import { CreateJobInput } from "../schema/job.schema";
import JobModel from "../models/job.model";
import { sendResponse, sendPaginatedResponse } from "../utils/api-response";
import { getJobs } from "../services/job.services";
import { IdSchema } from "../schema/common.schema";
import { NotFoundError } from "../utils/errors";

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

export const deleteJobHandler = asyncHandler(
  async (req: Request<IdSchema>, res: Response) => {
    const { id } = req.params;
    const deletedJob = await JobModel.findByIdAndDelete(id);
    if (!deletedJob) {
      throw new NotFoundError("Job not found");
    }
    sendResponse(res, deletedJob, "Job deleted successfully", 200);
  }
);