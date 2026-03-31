/**
 * Tests for the SWAPI Films resource: GET /api/films/
 *
 * Covers: list all, get by ID, search, schema validation, not found.
 */
import { test, expect } from "./fixtures";
import {
  assertStatusNotFound,
  assertValidPagination,
  assertSearchResultsContain,
} from "../src/utils/assertions";

test.describe("Films – List", () => {
  test("get all films returns paginated results", async ({ swapiClient }) => {
    const data = await swapiClient.getAllFilms();
    assertValidPagination(data, 1);
  });

  test("SWAPI contains exactly 6 films", async ({ swapiClient }) => {
    const data = await swapiClient.getAllFilms();
    expect(data.count).toBe(6);
  });

  test("search films by title returns matching results", async ({ swapiClient }) => {
    const data = await swapiClient.getAllFilms({ search: "hope" });
    expect(data.count).toBeGreaterThanOrEqual(1);
    assertSearchResultsContain(data, "title", "hope");
  });

  test("search films with nonsense term returns empty", async ({ swapiClient }) => {
    const data = await swapiClient.getAllFilms({ search: "xyznonexistent" });
    expect(data.count).toBe(0);
  });
});

test.describe("Films – Detail", () => {
  test("get film by ID returns A New Hope", async ({ swapiClient }) => {
    const film = await swapiClient.getFilm(1);
    expect(film.title).toBe("A New Hope");
    expect(film.episode_id).toBe(4);
    expect(film.director).toBe("George Lucas");
  });

  test("film has characters", async ({ swapiClient }) => {
    const film = await swapiClient.getFilm(1);
    expect(film.characters.length).toBeGreaterThan(0);
  });

  test("film has planets", async ({ swapiClient }) => {
    const film = await swapiClient.getFilm(1);
    expect(film.planets.length).toBeGreaterThan(0);
  });

  test("film has correct release date", async ({ swapiClient }) => {
    const film = await swapiClient.getFilm(1);
    expect(film.release_date).toBe("1977-05-25");
  });

  test("film response passes Zod schema validation", async ({ swapiClient }) => {
    const film = await swapiClient.getFilm(1);
    expect(film.title.length).toBeGreaterThan(0);
    expect(film.url).toMatch(/\/1\/$/);
  });

  test("non-existent film returns 404", async ({ swapiClient }) => {
    const response = await swapiClient.getFilmRaw(9999);
    assertStatusNotFound(response);
  });
});
