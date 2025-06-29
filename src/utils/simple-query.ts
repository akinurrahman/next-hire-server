import { Model, Document, FilterQuery } from "mongoose";
import {
  PaginationQuery,
  PaginatedResult,
  SearchQuery,
} from "../types/query.types";

const DEFAULT_PAGE = 1;
const DEFAULT_LIMIT = 10;
const MAX_LIMIT = 100;

/**
 * Clean search input to prevent injection
 */
const cleanSearch = (input: string): string => {
  if (!input || typeof input !== "string") return "";
  return input
    .replace(/[.*+?^${}()|[\]\\]/g, "\\$&") // Escape special characters
    .trim()
    .substring(0, 100); // Limit length
};

/**
 * Parse pagination from req.query
 */
const getPagination = (query: SearchQuery): PaginationQuery => {
  const page = Math.max(1, parseInt(String(query.page)) || DEFAULT_PAGE);
  const limit = Math.min(
    MAX_LIMIT,
    Math.max(1, parseInt(String(query.limit)) || DEFAULT_LIMIT)
  );
  const skip = (page - 1) * limit;

  return {
    page,
    limit,
    skip,
    sortBy: query.sortBy,
    sortOrder: query.sortOrder === "desc" ? "desc" : "asc",
  };
};


/**
 * Full featured query - search + filter + safe sorting
 */
export const queryData = async <T extends Document>(
  model: Model<T>,
  reqQuery: SearchQuery,
  config: {
    searchFields: string[];
    filterFields: string[];
    baseFilter?: FilterQuery<T>;
    allowedSortFields?: string[];
    populate?: string | any[] | any;
  }
): Promise<PaginatedResult<T>> => {

  const {
    searchFields,
    filterFields,
    baseFilter = {},
    allowedSortFields = [],
    populate = "",
  } = config;

  const pagination = getPagination(reqQuery);
  let filter: any = { ...baseFilter };

  // Add search
  if (reqQuery.search && searchFields.length > 0) {
    const cleanedSearch = cleanSearch(reqQuery.search);
    if (cleanedSearch) {
      const searchConditions = searchFields.map((field) => ({
        [field]: { $regex: cleanedSearch, $options: "i" },
      }));
      filter.$or = searchConditions;
    }
  }

  // Add filters
  filterFields.forEach((field) => {
    if (reqQuery[field] !== undefined && reqQuery[field] !== "") {
      filter[field] = reqQuery[field];
    }
  });


  // Build sort (with safety check)
  let sortOptions: any = { createdAt: -1 };
  if (pagination.sortBy) {
    // Check if sort field is allowed
    const isAllowed =
      allowedSortFields.length === 0 ||
      allowedSortFields.includes(pagination.sortBy);

    if (isAllowed) {
      sortOptions = {
        [pagination.sortBy]: pagination.sortOrder === "desc" ? -1 : 1,
      };
    }
  }

  try {
    const [data, totalDocuments] = await Promise.all([
      model
        .find(filter)
        .sort(sortOptions)
        .skip(pagination.skip)
        .limit(pagination.limit)
        .populate(populate)
        .lean(),
      model.countDocuments(filter),
    ]);

    const totalPages = Math.ceil(totalDocuments / pagination.limit);

    return {
      data: data as T[],
      pagination: {
        currentPage: pagination.page,
        totalPages,
        totalDocuments,
        hasNextPage: pagination.page < totalPages,
        hasPrevPage: pagination.page > 1,
        limit: pagination.limit,
      },
    };
  } catch (error) {
    throw new Error(`Query failed: ${error}`);
  }
};
