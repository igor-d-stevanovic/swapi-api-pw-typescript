/**
 * Tests for the SWAPI Starships resource: GET /api/starships/
 *
 * Covers: list all, get by ID, search, pagination, not found, schema validation.
 */
import { test, expect } from "./fixtures";
import {
  assertStatusNotFound,
  assertValidPagination,
  assertSearchResultsContain,
} from "../src/utils/assertions";

test.describe("Starships – List", () => {
  test("get all starships returns paginated results", async ({ swapiClient }) => {
    const data = await swapiClient.getAllStarships();
    assertValidPagination(data, 1);
  });

  test("starships page size is at most 10", async ({ swapiClient }) => {
    const data = await swapiClient.getAllStarships();
    expect(data.results.length).toBeLessThanOrEqual(10);
  });

  test("starships pagination returns different results per page", async ({ swapiClient }) => {
    const page1 = await swapiClient.getAllStarships({ page: 1 });
    const page2 = await swapiClient.getAllStarships({ page: 2 });
    expect(page2.previous).not.toBeNull();
    const page1Names = new Set(page1.results.map((s) => s.name));
    const page2Names = new Set(page2.results.map((s) => s.name));
    const intersection = [...page1Names].filter((n) => page2Names.has(n));
    expect(intersection.length).toBe(0);
  });

  test("search starships by name returns matching results", async ({ swapiClient }) => {
    const data = await swapiClient.getAllStarships({ search: "death" });
    expect(data.count).toBeGreaterThanOrEqual(1);
    assertSearchResultsContain(data, "name", "death");
  });

  test("search starships with nonsense term returns empty", async ({ swapiClient }) => {
    const data = await swapiClient.getAllStarships({ search: "xyznonexistent" });
    expect(data.count).toBe(0);
  });
});

test.describe("Starships – Detail", () => {
  test("get starship by ID returns Death Star", async ({ swapiClient }) => {
    const starship = await swapiClient.getStarship(9);
    expect(starship.name).toBe("Death Star");
    expect(starship.model).toBe("DS-1 Orbital Battle Station");
  });

  test("starship has correct manufacturer", async ({ swapiClient }) => {
    const starship = await swapiClient.getStarship(9);
    expect(starship.manufacturer).toContain("Imperial Department of Military Research");
  });

  test("starship appears in at least one film", async ({ swapiClient }) => {
    const starship = await swapiClient.getStarship(9);
    expect(starship.films.length).toBeGreaterThan(0);
  });

  test("starship has a hyperdrive rating", async ({ swapiClient }) => {
    const starship = await swapiClient.getStarship(9);
    expect(starship.hyperdrive_rating).not.toBe("unknown");
  });

  test("starship response passes Zod schema validation", async ({ swapiClient }) => {
    const starship = await swapiClient.getStarship(9);
    expect(starship.name.length).toBeGreaterThan(0);
    expect(starship.url).toMatch(/\/9\/$/);
  });

  test("non-existent starship returns 404", async ({ swapiClient }) => {
    const response = await swapiClient.getStarshipRaw(9999);
    assertStatusNotFound(response);
  });
});
