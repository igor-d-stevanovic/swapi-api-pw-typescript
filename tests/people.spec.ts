/**
 * Tests for the SWAPI People resource: GET /api/people/
 *
 * Covers: list all, get by ID, search, pagination, not found, schema validation.
 */
import { test, expect } from "./fixtures";
import {
  assertStatusNotFound,
  assertValidPagination,
  assertSearchResultsContain,
} from "../src/utils/assertions";

test.describe("People – List", () => {
  test("get all people returns paginated results", async ({ swapiClient }) => {
    const data = await swapiClient.getAllPeople();
    assertValidPagination(data, 1);
  });

  test("people page size is at most 10", async ({ swapiClient }) => {
    const data = await swapiClient.getAllPeople();
    expect(data.results.length).toBeLessThanOrEqual(10);
  });

  test("people pagination returns different results per page", async ({ swapiClient }) => {
    const page1 = await swapiClient.getAllPeople({ page: 1 });
    const page2 = await swapiClient.getAllPeople({ page: 2 });
    expect(page2.previous, "Page 2 should have a 'previous' link").not.toBeNull();
    const page1Names = new Set(page1.results.map((p) => p.name));
    const page2Names = new Set(page2.results.map((p) => p.name));
    const intersection = [...page1Names].filter((n) => page2Names.has(n));
    expect(intersection.length, "Page 1 and 2 should have different people").toBe(0);
  });

  test("search people by name returns matching results", async ({ swapiClient }) => {
    const data = await swapiClient.getAllPeople({ search: "luke" });
    expect(data.count).toBeGreaterThanOrEqual(1);
    assertSearchResultsContain(data, "name", "luke");
  });

  test("search people with nonsense term returns empty", async ({ swapiClient }) => {
    const data = await swapiClient.getAllPeople({ search: "xyznonexistent" });
    expect(data.count).toBe(0);
    expect(data.results.length).toBe(0);
  });
});

test.describe("People – Detail", () => {
  test("get person by ID returns Luke Skywalker", async ({ swapiClient }) => {
    const person = await swapiClient.getPerson(1);
    expect(person.name).toBe("Luke Skywalker");
    expect(person.birth_year).toBe("19BBY");
  });

  test("person has a valid homeworld URL", async ({ swapiClient }) => {
    const person = await swapiClient.getPerson(1);
    expect(person.homeworld).toMatch(/^https?:\/\//);
    expect(person.homeworld).toContain("/api/planets/");
  });

  test("person appears in at least one film", async ({ swapiClient }) => {
    const person = await swapiClient.getPerson(1);
    expect(person.films.length).toBeGreaterThan(0);
  });

  test("person response passes Zod schema validation", async ({ swapiClient }) => {
    const person = await swapiClient.getPerson(1);
    expect(person.name.length).toBeGreaterThan(0);
    expect(person.url).toMatch(/\/1\/$/);
  });

  test("non-existent person returns 404", async ({ swapiClient }) => {
    const response = await swapiClient.getPersonRaw(9999);
    assertStatusNotFound(response);
  });
});
