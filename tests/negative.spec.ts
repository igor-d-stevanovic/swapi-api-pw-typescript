/**
 * Negative and edge-case tests for SWAPI endpoints.
 *
 * Covers: malformed params, special characters, boundary values, empty search.
 */
import { test, expect } from "./fixtures";
import { assertStatusNotFound } from "../src/utils/assertions";

test.describe("Negative – Edge Cases", () => {
  test("invalid page parameter returns 404", async ({ request }) => {
    const response = await request.get("/api/people/", { params: { page: "0" } });
    expect(response.status()).toBe(404);
  });

  test("non-numeric page parameter returns 404", async ({ request }) => {
    const response = await request.get("/api/people/", { params: { page: "abc" } });
    expect(response.status()).toBe(404);
  });

  test("empty search term returns all results", async ({ swapiClient }) => {
    const data = await swapiClient.getAllPeople({ search: "" });
    expect(data.count).toBeGreaterThan(0);
  });

  test("search with special characters returns empty", async ({ swapiClient }) => {
    const data = await swapiClient.getAllPeople({ search: "<script>alert(1)</script>" });
    expect(data.count).toBe(0);
  });

  test("very large page number returns 404", async ({ request }) => {
    const response = await request.get("/api/people/", { params: { page: "999999" } });
    assertStatusNotFound(response);
  });

  for (const resource of ["people", "planets", "films", "species", "vehicles", "starships"]) {
    test(`non-existent ${resource} ID 9999 returns 404`, async ({ request }) => {
      const response = await request.get(`/api/${resource}/9999/`);
      assertStatusNotFound(response);
    });
  }

  test("trailing-slash-less URL redirects or works", async ({ request }) => {
    const response = await request.get("/api/people/1");
    expect([200, 301, 302]).toContain(response.status());
  });

  test("non-existent endpoint returns 404", async ({ request }) => {
    const response = await request.get("/api/nonexistent/");
    assertStatusNotFound(response);
  });
});
