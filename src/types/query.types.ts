export interface PaginationOptions {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}

export interface PaginationQuery {
  page: number;
  limit: number;
  skip: number;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}

export interface PaginationMetadata {
  currentPage: number;
  totalPages: number;
  totalDocuments: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
  limit: number;
}

export interface PaginatedResult<T> {
  data: T[];
  pagination: PaginationMetadata;
}

// Simple search and filter interfaces
export interface SearchQuery {
  search?: string;
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
  [key: string]: any; // For additional filters
}

export interface QueryOptions<T> {
  searchFields?: string[]; // Fields to search in
  filterFields?: string[]; // Fields that can be filtered
  defaultFilter?: Partial<T>; // Always applied filters
  allowedSortFields?: string[]; // Fields that can be sorted by
  populateFields?: string | any[] | any; // Fields to populate (supports field selection)
}
