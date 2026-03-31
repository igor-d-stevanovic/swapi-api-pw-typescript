/**
 * Application settings for the SWAPI test framework.
 * Values can be overridden via environment variables.
 */
export const settings = {
  baseUrl: process.env.SWAPI_BASE_URL ?? "https://swapi.dev",
  /** Request timeout in milliseconds */
  timeout: Number(process.env.SWAPI_TIMEOUT ?? 30_000),
  /** Response time SLA (ms) */
  maxResponseTimeMs: Number(process.env.SWAPI_MAX_RESPONSE_TIME_MS ?? 5_000),
  /** Retry count for transient failures */
  retries: Number(process.env.SWAPI_RETRIES ?? 2),
  /** Base delay between retries in milliseconds */
  retryDelayMs: Number(process.env.SWAPI_RETRY_DELAY_MS ?? 500),
} as const;
