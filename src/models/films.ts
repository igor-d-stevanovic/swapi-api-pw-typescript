/** Zod schema for the SWAPI Films resource. */
import { z } from "zod";

export const FilmSchema = z.object({
  /** The title of this film */
  title: z.string(),
  /** The episode number (1-6) */
  episode_id: z.number().int(),
  /** The opening paragraphs at the start of the film */
  opening_crawl: z.string(),
  /** The name of the director */
  director: z.string(),
  /** Comma-separated list of producers */
  producer: z.string(),
  /** Release date in YYYY-MM-DD format */
  release_date: z.string(),
  /** URLs of characters in this film */
  characters: z.array(z.string().url()),
  /** URLs of planets featured in this film */
  planets: z.array(z.string().url()),
  /** URLs of starships in this film */
  starships: z.array(z.string().url()),
  /** URLs of vehicles in this film */
  vehicles: z.array(z.string().url()),
  /** URLs of species in this film */
  species: z.array(z.string().url()),
  /** ISO 8601 creation timestamp */
  created: z.string(),
  /** ISO 8601 last-edit timestamp */
  edited: z.string(),
  /** Canonical URL of this resource */
  url: z.string().url(),
});

export type Film = z.infer<typeof FilmSchema>;
