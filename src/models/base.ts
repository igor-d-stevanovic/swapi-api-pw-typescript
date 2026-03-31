/**
 * Base models shared across all SWAPI resources.
 *
 * PaginatedResponse is a generic wrapper for any paginated list endpoint.
 */
import { z } from "zod";

/**
 * Generic paginated response returned by all SWAPI list endpoints.
 */
export function PaginatedResponseSchema<T extends z.ZodTypeAny>(itemSchema: T) {
  return z.object({
    /** Total number of resources matching the query */
    count: z.number().int(),
    /** URL of the next page, or null */
    next: z.string().url().nullable(),
    /** URL of the previous page, or null */
    previous: z.string().url().nullable(),
    /** List of resource objects on the current page */
    results: z.array(itemSchema),
  });
}

export type PaginatedResponse<T> = {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
};
