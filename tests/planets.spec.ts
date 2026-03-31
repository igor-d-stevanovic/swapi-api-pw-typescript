/**
 * Tests for the SWAPI Planets resource: GET /api/planets/
 *
 * Covers: list all, get by ID, search, pagination, not found, schema validation.
 */
import { test, expect } from "./fixtures";
import {
  assertStatusNotFound,
  assertValidPagination,
  assertSearchResultsContain,
} from "../src/utils/assertions";

test.describe("Planets – List", () => {
  test("get all planets returns paginated results", async ({ swapiClient }) => {
    const data = await swapiClient.getAllPlanets();
    assertValidPagination(data, 1);
  });

  test("planets page size is at most 10", async ({ swapiClient }) => {
    const data = await swapiClient.getAllPlanets();
    expect(data.results.length).toBeLessThanOrEqual(10);
  });

  test("planets pagination returns different results per page", async ({ swapiClient }) => {
    const page1 = await swapiClient.getAllPlanets({ page: 1 });
    const page2 = await swapiClient.getAllPlanets({ page: 2 });
    expect(page2.previous).not.toBeNull();
    const page1Names = new Set(page1.results.map((p) => p.name));
    const page2Names = new Set(page2.results.map((p) => p.name));
    const intersection = [...page1Names].filter((n) => page2Names.has(n));
    expect(intersection.length).toBe(0);
  });

  test("search planets by name returns matching results", async ({ swapiClient }) => {
    const data = await swapiClient.getAllPlanets({ search: "tatooine" });
    expect(data.count).toBeGreaterThanOrEqual(1);
    assertSearchResultsContain(data, "name", "tatooine");
  });

  test("search planets with nonsense term returns empty", async ({ swapiClient }) => {
    const data = await swapiClient.getAllPlanets({ search: "xyznonexistent" });
    expect(data.count).toBe(0);
  });
});

test.describe("Planets – Detail", () => {
  test("get planet by ID returns Tatooine", async ({ swapiClient }) => {
    const planet = await swapiClient.getPlanet(1);
    expect(planet.name).toBe("Tatooine");
    expect(planet.climate).toBe("arid");
    expect(planet.terrain).toBe("desert");
  });

  test("planet has residents", async ({ swapiClient }) => {
    const planet = await swapiClient.getPlanet(1);
    expect(planet.residents.length).toBeGreaterThan(0);
  });

  test("planet response passes Zod schema validation", async ({ swapiClient }) => {
    const planet = await swapiClient.getPlanet(1);
    expect(planet.name.length).toBeGreaterThan(0);
    expect(planet.url).toMatch(/\/1\/$/);
  });

  test("non-existent planet returns 404", async ({ swapiClient }) => {
    const response = await swapiClient.getPlanetRaw(9999);
    assertStatusNotFound(response);
  });
});
