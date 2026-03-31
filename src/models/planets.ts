/** Zod schema for the SWAPI Planets resource. */
import { z } from "zod";

export const PlanetSchema = z.object({
  /** The name of this planet */
  name: z.string(),
  /** Rotation period in hours, or 'unknown' */
  rotation_period: z.string(),
  /** Orbital period in days, or 'unknown' */
  orbital_period: z.string(),
  /** Diameter in kilometers, or 'unknown' */
  diameter: z.string(),
  /** Comma-separated climate types */
  climate: z.string(),
  /** Gravity relative to Earth standard */
  gravity: z.string(),
  /** Comma-separated terrain types */
  terrain: z.string(),
  /** Percentage of surface covered by water */
  surface_water: z.string(),
  /** Population count, or 'unknown' */
  population: z.string(),
  /** URLs of people living on this planet */
  residents: z.array(z.string().url()),
  /** URLs of films featuring this planet */
  films: z.array(z.string().url()),
  /** ISO 8601 creation timestamp */
  created: z.string(),
  /** ISO 8601 last-edit timestamp */
  edited: z.string(),
  /** Canonical URL of this resource */
  url: z.string().url(),
});

export type Planet = z.infer<typeof PlanetSchema>;
