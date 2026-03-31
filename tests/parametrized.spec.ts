/**
 * Parametrized tests – data-driven tests across multiple IDs for each resource.
 *
 * Uses test.each to test several known entities per resource,
 * reducing duplication.
 */
import { test, expect } from "./fixtures";
import { assertResponseTime } from "../src/utils/assertions";

// ---------------------------------------------------------------------------
// People
// ---------------------------------------------------------------------------

test.describe("People – Parametrized", () => {
  const people: [number, string][] = [
    [1, "Luke Skywalker"],
    [2, "C-3PO"],
    [3, "R2-D2"],
    [4, "Darth Vader"],
    [5, "Leia Organa"],
  ];

  for (const [personId, expectedName] of people) {
    test(`get person ${personId} returns ${expectedName}`, async ({ swapiClient }) => {
      const person = await swapiClient.getPerson(personId);
      expect(person.name).toBe(expectedName);
    });
  }

  for (const personId of [1, 2, 3, 4, 5]) {
    test(`person ${personId} responds within SLA`, async ({ swapiClient }) => {
      const timed = await swapiClient.getTimedRequest(`/api/people/${personId}/`);
      assertResponseTime(timed);
    });
  }
});

// ---------------------------------------------------------------------------
// Planets
// ---------------------------------------------------------------------------

test.describe("Planets – Parametrized", () => {
  const planets: [number, string][] = [
    [1, "Tatooine"],
    [2, "Alderaan"],
    [3, "Yavin IV"],
    [5, "Dagobah"],
    [8, "Naboo"],
  ];

  for (const [planetId, expectedName] of planets) {
    test(`get planet ${planetId} returns ${expectedName}`, async ({ swapiClient }) => {
      const planet = await swapiClient.getPlanet(planetId);
      expect(planet.name).toBe(expectedName);
    });
  }
});

// ---------------------------------------------------------------------------
// Films
// ---------------------------------------------------------------------------

test.describe("Films – Parametrized", () => {
  const films: [number, string, number][] = [
    [1, "A New Hope", 4],
    [2, "The Empire Strikes Back", 5],
    [3, "Return of the Jedi", 6],
    [4, "The Phantom Menace", 1],
    [5, "Attack of the Clones", 2],
    [6, "Revenge of the Sith", 3],
  ];

  for (const [filmId, expectedTitle, expectedEpisode] of films) {
    test(`get film ${filmId} returns '${expectedTitle}' (Episode ${expectedEpisode})`, async ({ swapiClient }) => {
      const film = await swapiClient.getFilm(filmId);
      expect(film.title).toBe(expectedTitle);
      expect(film.episode_id).toBe(expectedEpisode);
    });
  }
});

// ---------------------------------------------------------------------------
// Species
// ---------------------------------------------------------------------------

test.describe("Species – Parametrized", () => {
  const species: [number, string][] = [
    [1, "Human"],
    [2, "Droid"],
    [3, "Wookie"],
    [5, "Hutt"],
    [6, "Yoda's species"],
  ];

  for (const [speciesId, expectedName] of species) {
    test(`get species ${speciesId} returns ${expectedName}`, async ({ swapiClient }) => {
      const s = await swapiClient.getSpecies(speciesId);
      expect(s.name).toBe(expectedName);
    });
  }
});

// ---------------------------------------------------------------------------
// Vehicles
// ---------------------------------------------------------------------------

test.describe("Vehicles – Parametrized", () => {
  const vehicles: [number, string][] = [
    [4, "Sand Crawler"],
    [6, "T-16 skyhopper"],
    [7, "X-34 landspeeder"],
    [8, "TIE/LN starfighter"],
    [14, "Snowspeeder"],
  ];

  for (const [vehicleId, expectedName] of vehicles) {
    test(`get vehicle ${vehicleId} returns ${expectedName}`, async ({ swapiClient }) => {
      const vehicle = await swapiClient.getVehicle(vehicleId);
      expect(vehicle.name).toBe(expectedName);
    });
  }
});

// ---------------------------------------------------------------------------
// Starships
// ---------------------------------------------------------------------------

test.describe("Starships – Parametrized", () => {
  const starships: [number, string][] = [
    [2, "CR90 corvette"],
    [3, "Star Destroyer"],
    [9, "Death Star"],
    [10, "Millennium Falcon"],
    [12, "X-wing"],
  ];

  for (const [starshipId, expectedName] of starships) {
    test(`get starship ${starshipId} returns ${expectedName}`, async ({ swapiClient }) => {
      const starship = await swapiClient.getStarship(starshipId);
      expect(starship.name).toBe(expectedName);
    });
  }
});

// ---------------------------------------------------------------------------
// Cross-resource chaining
// ---------------------------------------------------------------------------

test.describe("Cross-Resource – Chaining", () => {
  test("person homeworld URL resolves to a valid planet", async ({ swapiClient }) => {
    const person = await swapiClient.getPerson(1);
    const planetId = parseInt(person.homeworld.replace(/\/$/, "").split("/").at(-1)!, 10);
    const planet = await swapiClient.getPlanet(planetId);
    expect(planet.name).toBe("Tatooine");
  });

  test("film characters resolve to valid people", async ({ swapiClient }) => {
    const film = await swapiClient.getFilm(1);
    const charId = parseInt(film.characters[0].replace(/\/$/, "").split("/").at(-1)!, 10);
    const person = await swapiClient.getPerson(charId);
    expect(person.name.length).toBeGreaterThan(0);
  });

  test("planet residents are valid people", async ({ swapiClient }) => {
    const planet = await swapiClient.getPlanet(1);
    const residentId = parseInt(planet.residents[0].replace(/\/$/, "").split("/").at(-1)!, 10);
    const person = await swapiClient.getPerson(residentId);
    expect(person.name).toBe("Luke Skywalker");
  });

  test("species people are valid persons", async ({ swapiClient }) => {
    const species = await swapiClient.getSpecies(1);
    const personId = parseInt(species.people[0].replace(/\/$/, "").split("/").at(-1)!, 10);
    const person = await swapiClient.getPerson(personId);
    expect(person.name.length).toBeGreaterThan(0);
  });
});
