/**
 * Reusable assertion helpers for SWAPI API tests.
 *
 * These keep test files clean and provide clear failure messages.
 */
import { expect, APIResponse } from "@playwright/test";
import { TimedResponse } from "../clients/base-client";
import { settings } from "../config/settings";
import { PaginatedResponse } from "../models/base";

// ---------------------------------------------------------------------------
// Status helpers
// ---------------------------------------------------------------------------

/** Assert that the response has a 200 OK status. */
export function assertStatusOk(response: APIResponse): void {
  expect(
    response.status(),
    `Expected status 200, got ${response.status()}. URL: ${response.url()}`,
  ).toBe(200);
}

/** Assert that the response has a 404 Not Found status. */
export function assertStatusNotFound(response: APIResponse): void {
  expect(
    response.status(),
    `Expected status 404, got ${response.status()}. URL: ${response.url()}`,
  ).toBe(404);
}

// ---------------------------------------------------------------------------
// Response time helpers
// ---------------------------------------------------------------------------

/**
 * Assert the response completed within maxMs milliseconds.
 *
 * If maxMs is not given, uses settings.maxResponseTimeMs.
 */
export function assertResponseTime(timed: TimedResponse, maxMs?: number): void {
  const limit = maxMs ?? settings.maxResponseTimeMs;
  expect(
    timed.elapsedMs,
    `Response too slow: ${timed.elapsedMs.toFixed(0)} ms > ${limit} ms. URL: ${timed.url}`,
  ).toBeLessThanOrEqual(limit);
}

// ---------------------------------------------------------------------------
// Pagination helpers
// ---------------------------------------------------------------------------

/**
 * Assert basic pagination invariants.
 *
 * - count is at least minCount
 * - results list is not empty
 * - results length ≤ count (page is a subset of total)
 */
export function assertValidPagination<T>(
  data: PaginatedResponse<T>,
  minCount = 1,
): void {
  expect(
    data.count,
    `Expected count >= ${minCount}, got ${data.count}`,
  ).toBeGreaterThanOrEqual(minCount);
  expect(data.results.length, "Expected at least one result on the page").toBeGreaterThan(0);
  expect(
    data.results.length,
    `Page has ${data.results.length} items but total count is ${data.count}`,
  ).toBeLessThanOrEqual(data.count);
}

/**
 * Assert every result in the page has term (case-insensitive) in the given field.
 */
export function assertSearchResultsContain<T extends Record<string, unknown>>(
  data: PaginatedResponse<T>,
  field: keyof T,
  term: string,
): void {
  const termLower = term.toLowerCase();
  for (const item of data.results) {
    const value = String(item[field]);
    expect(
      value.toLowerCase(),
      `Expected '${term}' in '${String(field)}' but got '${value}'`,
    ).toContain(termLower);
  }
}
