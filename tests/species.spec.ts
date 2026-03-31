/**
 * Tests for the SWAPI Species resource: GET /api/species/
 *
 * Covers: list all, get by ID, search, pagination, not found, schema validation.
 */
import { test, expect } from "./fixtures";
import {
  assertStatusNotFound,
  assertValidPagination,
  assertSearchResultsContain,
} from "../src/utils/assertions";

test.describe("Species – List", () => {
  test("get all species returns paginated results", async ({ swapiClient }) => {
    const data = await swapiClient.getAllSpecies();
    assertValidPagination(data, 1);
  });

  test("species page size is at most 10", async ({ swapiClient }) => {
    const data = await swapiClient.getAllSpecies();
    expect(data.results.length).toBeLessThanOrEqual(10);
  });

  test("species pagination returns different results per page", async ({ swapiClient }) => {
    const page1 = await swapiClient.getAllSpecies({ page: 1 });
    const page2 = await swapiClient.getAllSpecies({ page: 2 });
    expect(page2.previous).not.toBeNull();
    const page1Names = new Set(page1.results.map((s) => s.name));
    const page2Names = new Set(page2.results.map((s) => s.name));
    const intersection = [...page1Names].filter((n) => page2Names.has(n));
    expect(intersection.length).toBe(0);
  });

  test("search species by name returns matching results", async ({ swapiClient }) => {
    const data = await swapiClient.getAllSpecies({ search: "human" });
    expect(data.count).toBeGreaterThanOrEqual(1);
    assertSearchResultsContain(data, "name", "human");
  });

  test("search species with nonsense term returns empty", async ({ swapiClient }) => {
    const data = await swapiClient.getAllSpecies({ search: "xyznonexistent" });
    expect(data.count).toBe(0);
  });
});

test.describe("Species – Detail", () => {
  test("get species by ID returns Human", async ({ swapiClient }) => {
    const species = await swapiClient.getSpecies(1);
    expect(species.name).toBe("Human");
    expect(species.classification).toBe("mammal");
    expect(species.designation).toBe("sentient");
  });

  test("species has people", async ({ swapiClient }) => {
    const species = await swapiClient.getSpecies(1);
    expect(species.people.length).toBeGreaterThan(0);
  });

  test("species has correct language", async ({ swapiClient }) => {
    const species = await swapiClient.getSpecies(1);
    expect(species.language).toBe("Galactic Basic");
  });

  test("species response passes Zod schema validation", async ({ swapiClient }) => {
    const species = await swapiClient.getSpecies(1);
    expect(species.name.length).toBeGreaterThan(0);
    expect(species.url).toMatch(/\/1\/$/);
  });

  test("non-existent species returns 404", async ({ swapiClient }) => {
    const response = await swapiClient.getSpeciesRaw(9999);
    assertStatusNotFound(response);
  });
});
