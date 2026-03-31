/**
 * High-level SWAPI client with typed methods for every resource.
 *
 * Each method fetches the raw JSON, validates it through a Zod schema,
 * and returns a fully typed TypeScript object.  This gives you auto-complete
 * in your IDE and automatic schema validation in every test.
 */
import { APIRequestContext, APIResponse } from "@playwright/test";
import { BaseApiClient, TimedResponse } from "./base-client";
import { settings } from "../config/settings";
import { PaginatedResponse, PaginatedResponseSchema } from "../models/base";
import { Film, FilmSchema } from "../models/films";
import { Person, PersonSchema } from "../models/people";
import { Planet, PlanetSchema } from "../models/planets";
import { Species, SpeciesSchema } from "../models/species";
import { Starship, StarshipSchema } from "../models/starships";
import { Vehicle, VehicleSchema } from "../models/vehicles";

type QueryParams = Record<string, string | number> | undefined;

export class SwapiClient extends BaseApiClient {
  constructor(context: APIRequestContext) {
    super(context, {
      retries: settings.retries,
      retryDelayMs: settings.retryDelayMs,
    });
  }

  // -- Root --------------------------------------------------------------

  /** GET /api/ – returns a mapping of resource name → URL. */
  async getRoot(): Promise<Record<string, string>> {
    const data = await this.getJson("/api/");
    return data as Record<string, string>;
  }

  // -- People ------------------------------------------------------------

  /** GET /api/people/ with optional pagination & search. */
  async getAllPeople(options?: { page?: number; search?: string }): Promise<PaginatedResponse<Person>> {
    const params = buildParams(options);
    const data = await this.getJson("/api/people/", params);
    return PaginatedResponseSchema(PersonSchema).parse(data);
  }

  /** GET /api/people/{id}/ */
  async getPerson(personId: number): Promise<Person> {
    const data = await this.getJson(`/api/people/${personId}/`);
    return PersonSchema.parse(data);
  }

  /** GET /api/people/{id}/ – returns the raw response (for status checks). */
  async getPersonRaw(personId: number): Promise<APIResponse> {
    return this.get(`/api/people/${personId}/`);
  }

  // -- Planets -----------------------------------------------------------

  /** GET /api/planets/ with optional pagination & search. */
  async getAllPlanets(options?: { page?: number; search?: string }): Promise<PaginatedResponse<Planet>> {
    const params = buildParams(options);
    const data = await this.getJson("/api/planets/", params);
    return PaginatedResponseSchema(PlanetSchema).parse(data);
  }

  /** GET /api/planets/{id}/ */
  async getPlanet(planetId: number): Promise<Planet> {
    const data = await this.getJson(`/api/planets/${planetId}/`);
    return PlanetSchema.parse(data);
  }

  /** GET /api/planets/{id}/ – returns the raw response. */
  async getPlanetRaw(planetId: number): Promise<APIResponse> {
    return this.get(`/api/planets/${planetId}/`);
  }

  // -- Films -------------------------------------------------------------

  /** GET /api/films/ with optional pagination & search. */
  async getAllFilms(options?: { page?: number; search?: string }): Promise<PaginatedResponse<Film>> {
    const params = buildParams(options);
    const data = await this.getJson("/api/films/", params);
    return PaginatedResponseSchema(FilmSchema).parse(data);
  }

  /** GET /api/films/{id}/ */
  async getFilm(filmId: number): Promise<Film> {
    const data = await this.getJson(`/api/films/${filmId}/`);
    return FilmSchema.parse(data);
  }

  /** GET /api/films/{id}/ – returns the raw response. */
  async getFilmRaw(filmId: number): Promise<APIResponse> {
    return this.get(`/api/films/${filmId}/`);
  }

  // -- Species -----------------------------------------------------------

  /** GET /api/species/ with optional pagination & search. */
  async getAllSpecies(options?: { page?: number; search?: string }): Promise<PaginatedResponse<Species>> {
    const params = buildParams(options);
    const data = await this.getJson("/api/species/", params);
    return PaginatedResponseSchema(SpeciesSchema).parse(data);
  }

  /** GET /api/species/{id}/ */
  async getSpecies(speciesId: number): Promise<Species> {
    const data = await this.getJson(`/api/species/${speciesId}/`);
    return SpeciesSchema.parse(data);
  }

  /** GET /api/species/{id}/ – returns the raw response. */
  async getSpeciesRaw(speciesId: number): Promise<APIResponse> {
    return this.get(`/api/species/${speciesId}/`);
  }

  // -- Vehicles ----------------------------------------------------------

  /** GET /api/vehicles/ with optional pagination & search. */
  async getAllVehicles(options?: { page?: number; search?: string }): Promise<PaginatedResponse<Vehicle>> {
    const params = buildParams(options);
    const data = await this.getJson("/api/vehicles/", params);
    return PaginatedResponseSchema(VehicleSchema).parse(data);
  }

  /** GET /api/vehicles/{id}/ */
  async getVehicle(vehicleId: number): Promise<Vehicle> {
    const data = await this.getJson(`/api/vehicles/${vehicleId}/`);
    return VehicleSchema.parse(data);
  }

  /** GET /api/vehicles/{id}/ – returns the raw response. */
  async getVehicleRaw(vehicleId: number): Promise<APIResponse> {
    return this.get(`/api/vehicles/${vehicleId}/`);
  }

  // -- Starships ---------------------------------------------------------

  /** GET /api/starships/ with optional pagination & search. */
  async getAllStarships(options?: { page?: number; search?: string }): Promise<PaginatedResponse<Starship>> {
    const params = buildParams(options);
    const data = await this.getJson("/api/starships/", params);
    return PaginatedResponseSchema(StarshipSchema).parse(data);
  }

  /** GET /api/starships/{id}/ */
  async getStarship(starshipId: number): Promise<Starship> {
    const data = await this.getJson(`/api/starships/${starshipId}/`);
    return StarshipSchema.parse(data);
  }

  /** GET /api/starships/{id}/ – returns the raw response. */
  async getStarshipRaw(starshipId: number): Promise<APIResponse> {
    return this.get(`/api/starships/${starshipId}/`);
  }

  // -- Timed (re-export for convenience) ---------------------------------

  /** GET with timing – delegates to BaseApiClient.getTimed(). */
  async getTimedRequest(endpoint: string): Promise<TimedResponse> {
    return this.getTimed(endpoint);
  }
}

function buildParams(
  options?: { page?: number; search?: string },
): QueryParams {
  if (!options) return undefined;
  const params: Record<string, string | number> = {};
  if (options.page !== undefined) params["page"] = options.page;
  if (options.search !== undefined) params["search"] = options.search;
  return Object.keys(params).length > 0 ? params : undefined;
}
