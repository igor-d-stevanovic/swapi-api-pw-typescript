/** Zod schema for the SWAPI Species resource. */
import { z } from "zod";

export const SpeciesSchema = z.object({
  /** The name of this species */
  name: z.string(),
  /** Classification such as mammal or reptile */
  classification: z.string(),
  /** Designation such as sentient or reptilian */
  designation: z.string(),
  /** Average height in centimeters, or 'unknown' */
  average_height: z.string(),
  /** Comma-separated common skin colors */
  skin_colors: z.string(),
  /** Comma-separated common hair colors */
  hair_colors: z.string(),
  /** Comma-separated common eye colors */
  eye_colors: z.string(),
  /** Average lifespan in years, or 'unknown' */
  average_lifespan: z.string(),
  /** URL of the homeworld planet, or null */
  homeworld: z.string().url().nullable(),
  /** Common language spoken by this species */
  language: z.string(),
  /** URLs of people belonging to this species */
  people: z.array(z.string().url()),
  /** URLs of films featuring this species */
  films: z.array(z.string().url()),
  /** ISO 8601 creation timestamp */
  created: z.string(),
  /** ISO 8601 last-edit timestamp */
  edited: z.string(),
  /** Canonical URL of this resource */
  url: z.string().url(),
});

export type Species = z.infer<typeof SpeciesSchema>;
