/**
 * Tests for the SWAPI root endpoint: GET /api/
 *
 * The root endpoint returns a JSON object mapping each resource name
 * to its list URL. These tests verify the response structure.
 */
import { test, expect } from "./fixtures";

const EXPECTED_RESOURCES = new Set(["people", "planets", "films", "species", "vehicles", "starships"]);

test.describe("Root Endpoint", () => {
  test("root endpoint returns HTTP 200", async ({ request }) => {
    const response = await request.get("/api/");
    expect(response.status()).toBe(200);
  });

  test("root response lists all six resources", async ({ swapiClient }) => {
    const data = await swapiClient.getRoot();
    const keys = new Set(Object.keys(data));
    expect(keys).toEqual(EXPECTED_RESOURCES);
  });

  test("root resource URLs are valid", async ({ swapiClient }) => {
    const data = await swapiClient.getRoot();
    for (const [resource, url] of Object.entries(data)) {
      expect(url, `Resource '${resource}' has invalid URL: ${url}`).toMatch(/^https?:\/\//);
      expect(url, `Resource '${resource}' URL missing /api/ path: ${url}`).toContain("/api/");
    }
  });
});
