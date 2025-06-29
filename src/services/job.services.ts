import { queryData } from "../utils/simple-query";
import JobModel from "../models/job.model";
import { SearchQuery } from "../types/query.types";

export const getJobs =async(reqQuery:SearchQuery)=>{
     const paginatedResult = await queryData(JobModel, reqQuery, {
       searchFields: ["title", "description", "company"],
       filterFields: ["status", "type", "location"],
       allowedSortFields: ["title", "company", "createdAt", "salary"],
       populate: {
         path: "postedBy",
         select: "fullName email",
       },
     });

     return paginatedResult;
}