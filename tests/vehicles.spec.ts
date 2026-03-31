/**
 * Tests for the SWAPI Vehicles resource: GET /api/vehicles/
 *
 * Covers: list all, get by ID, search, pagination, not found, schema validation.
 */
import { test, expect } from "./fixtures";
import {
  assertStatusNotFound,
  assertValidPagination,
  assertSearchResultsContain,
} from "../src/utils/assertions";

test.describe("Vehicles – List", () => {
  test("get all vehicles returns paginated results", async ({ swapiClient }) => {
    const data = await swapiClient.getAllVehicles();
    assertValidPagination(data, 1);
  });

  test("vehicles page size is at most 10", async ({ swapiClient }) => {
    const data = await swapiClient.getAllVehicles();
    expect(data.results.length).toBeLessThanOrEqual(10);
  });

  test("vehicles pagination returns different results per page", async ({ swapiClient }) => {
    const page1 = await swapiClient.getAllVehicles({ page: 1 });
    const page2 = await swapiClient.getAllVehicles({ page: 2 });
    expect(page2.previous).not.toBeNull();
    const page1Names = new Set(page1.results.map((v) => v.name));
    const page2Names = new Set(page2.results.map((v) => v.name));
    const intersection = [...page1Names].filter((n) => page2Names.has(n));
    expect(intersection.length).toBe(0);
  });

  test("search vehicles by name returns matching results", async ({ swapiClient }) => {
    const data = await swapiClient.getAllVehicles({ search: "sand" });
    expect(data.count).toBeGreaterThanOrEqual(1);
    assertSearchResultsContain(data, "name", "sand");
  });

  test("search vehicles with nonsense term returns empty", async ({ swapiClient }) => {
    const data = await swapiClient.getAllVehicles({ search: "xyznonexistent" });
    expect(data.count).toBe(0);
  });
});

test.describe("Vehicles – Detail", () => {
  test("get vehicle by ID returns Sand Crawler", async ({ swapiClient }) => {
    const vehicle = await swapiClient.getVehicle(4);
    expect(vehicle.name).toBe("Sand Crawler");
    expect(vehicle.model).toBe("Digger Crawler");
  });

  test("vehicle has correct manufacturer", async ({ swapiClient }) => {
    const vehicle = await swapiClient.getVehicle(4);
    expect(vehicle.manufacturer).toContain("Corellia Mining Corporation");
  });

  test("vehicle appears in at least one film", async ({ swapiClient }) => {
    const vehicle = await swapiClient.getVehicle(4);
    expect(vehicle.films.length).toBeGreaterThan(0);
  });

  test("vehicle response passes Zod schema validation", async ({ swapiClient }) => {
    const vehicle = await swapiClient.getVehicle(4);
    expect(vehicle.name.length).toBeGreaterThan(0);
    expect(vehicle.url).toMatch(/\/4\/$/);
  });

  test("non-existent vehicle returns 404", async ({ swapiClient }) => {
    const response = await swapiClient.getVehicleRaw(9999);
    assertStatusNotFound(response);
  });
});
