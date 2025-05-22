export const formatZodErrors = (error: any) => {
  const formatted: Record<string, string> = {};

  if (error.errors && Array.isArray(error.errors)) {
    for (const err of error.errors) {
      const field = err.path[1] || err.path[0];
      // Add the error message only if we haven't added one yet for this field
      if (!formatted[field]) {
        formatted[field] = err.message;
      }
    }
  }

  return formatted;
};
