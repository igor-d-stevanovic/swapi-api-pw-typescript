/**
 * Base API client wrapping Playwright's APIRequestContext.
 *
 * Features:
 *   - Request/response logging (method, URL, status, elapsed time).
 *   - Response timing via TimedResponse wrapper.
 *   - Automatic retries with exponential back-off for transient failures.
 */
import { APIRequestContext, APIResponse } from "@playwright/test";

/** HTTP status codes considered transient / retryable */
const RETRYABLE_STATUSES = new Set([500, 502, 503, 504, 408, 429]);

/**
 * Wraps a Playwright APIResponse with elapsed-time metadata.
 */
export interface TimedResponse {
  response: APIResponse;
  /** Wall-clock time in milliseconds for the request */
  elapsedMs: number;
  status: number;
  url: string;
  json(): Promise<unknown>;
}

function makeTimedResponse(response: APIResponse, elapsedMs: number): TimedResponse {
  return {
    response,
    elapsedMs,
    get status() {
      return response.status();
    },
    get url() {
      return response.url();
    },
    json() {
      return response.json() as Promise<unknown>;
    },
  };
}

/**
 * Thin wrapper around Playwright's APIRequestContext.
 *
 * Adds logging, timing, and retry support on top of the raw HTTP calls.
 */
export class BaseApiClient {
  protected readonly context: APIRequestContext;
  private readonly retries: number;
  private readonly retryDelayMs: number;
  private readonly retryStatuses: Set<number>;

  constructor(
    context: APIRequestContext,
    options: {
      retries?: number;
      retryDelayMs?: number;
      retryStatuses?: Set<number>;
    } = {},
  ) {
    this.context = context;
    this.retries = options.retries ?? 2;
    this.retryDelayMs = options.retryDelayMs ?? 500;
    this.retryStatuses = options.retryStatuses ?? RETRYABLE_STATUSES;
  }

  /** Send a GET request and return the raw APIResponse. */
  async get(endpoint: string, params?: Record<string, string | number>): Promise<APIResponse> {
    return (await this.requestWithRetry(endpoint, params)).response;
  }

  /** Send a GET request and return a TimedResponse with elapsed time. */
  async getTimed(endpoint: string, params?: Record<string, string | number>): Promise<TimedResponse> {
    return this.requestWithRetry(endpoint, params);
  }

  /** Send a GET request and return the parsed JSON body. */
  async getJson(endpoint: string, params?: Record<string, string | number>): Promise<unknown> {
    const response = await this.get(endpoint, params);
    return response.json();
  }

  /** Send a GET request and return only the HTTP status code. */
  async getStatus(endpoint: string, params?: Record<string, string | number>): Promise<number> {
    const response = await this.get(endpoint, params);
    return response.status();
  }

  private async requestWithRetry(
    endpoint: string,
    params?: Record<string, string | number>,
  ): Promise<TimedResponse> {
    let lastTimed: TimedResponse | undefined;
    let delayMs = this.retryDelayMs;

    for (let attempt = 0; attempt <= this.retries; attempt++) {
      const start = Date.now();
      const response = await this.context.get(endpoint, { params });
      const elapsedMs = Date.now() - start;

      lastTimed = makeTimedResponse(response, elapsedMs);

      const status = response.status();
      const attemptLabel = attempt > 0 ? ` [attempt ${attempt + 1}/${this.retries + 1}]` : "";
      console.info(`GET ${endpoint} -> ${status} (${elapsedMs} ms)${attemptLabel}`);

      if (!this.retryStatuses.has(status)) {
        return lastTimed;
      }

      if (attempt < this.retries) {
        console.warn(
          `Retryable status ${status} for ${endpoint} — retrying in ${delayMs}ms`,
        );
        await sleep(delayMs);
        delayMs *= 2;
      }
    }

    console.error(
      `All ${this.retries} retries exhausted for ${endpoint} (last status: ${lastTimed!.status})`,
    );
    return lastTimed!;
  }
}

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
