/**
 * Shared Playwright Test fixtures for all test files.
 *
 * Provides:
 *   swapiClient – A SwapiClient instance using the configured base URL.
 */
import { test as base, request } from "@playwright/test";
import { SwapiClient } from "../src/clients/swapi-client";
import { settings } from "../src/config/settings";

type SwapiFixtures = {
  swapiClient: SwapiClient;
};

export const test = base.extend<SwapiFixtures>({
  swapiClient: async ({ request: _req }, use) => {
    // Create a fresh APIRequestContext with the SWAPI base URL
    const context = await request.newContext({
      baseURL: settings.baseUrl,
      extraHTTPHeaders: { Accept: "application/json" },
    });
    const client = new SwapiClient(context);
    await use(client);
    await context.dispose();
  },
});

export { expect } from "@playwright/test";
