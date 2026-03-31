/** Zod schema for the SWAPI Starships resource. */
import { z } from "zod";

export const StarshipSchema = z.object({
  /** The name of this starship */
  name: z.string(),
  /** The model or official name */
  model: z.string(),
  /** Comma-separated list of manufacturers */
  manufacturer: z.string(),
  /** Cost in galactic credits, or 'unknown' */
  cost_in_credits: z.string(),
  /** Length in meters */
  length: z.string(),
  /** Max atmospheric speed, or 'n/a' */
  max_atmosphering_speed: z.string(),
  /** Number of crew required to operate */
  crew: z.string(),
  /** Number of non-crew passengers */
  passengers: z.string(),
  /** Max cargo capacity in kilograms */
  cargo_capacity: z.string(),
  /** Max time consumables last for crew */
  consumables: z.string(),
  /** Class of the hyperdrive */
  hyperdrive_rating: z.string(),
  /** Max megalights per hour */
  MGLT: z.string(),
  /** Class such as Starfighter or Deep Space Mobile Battlestation */
  starship_class: z.string(),
  /** URLs of people who piloted this starship */
  pilots: z.array(z.string().url()),
  /** URLs of films featuring this starship */
  films: z.array(z.string().url()),
  /** ISO 8601 creation timestamp */
  created: z.string(),
  /** ISO 8601 last-edit timestamp */
  edited: z.string(),
  /** Canonical URL of this resource */
  url: z.string().url(),
});

export type Starship = z.infer<typeof StarshipSchema>;
