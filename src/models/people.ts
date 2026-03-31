/** Zod schema for the SWAPI People resource. */
import { z } from "zod";

export const PersonSchema = z.object({
  /** The name of this person */
  name: z.string(),
  /** Height in centimeters, or 'unknown' */
  height: z.string(),
  /** Mass in kilograms, or 'unknown' */
  mass: z.string(),
  /** Hair color, or 'n/a' / 'none' */
  hair_color: z.string(),
  /** Skin color */
  skin_color: z.string(),
  /** Eye color */
  eye_color: z.string(),
  /** Birth year using BBY/ABY format, or 'unknown' */
  birth_year: z.string(),
  /** Gender: male, female, n/a, or hermaphrodite */
  gender: z.string(),
  /** URL of the person's homeworld planet */
  homeworld: z.string().url(),
  /** URLs of films this person appeared in */
  films: z.array(z.string().url()),
  /** URLs of species this person belongs to */
  species: z.array(z.string().url()),
  /** URLs of vehicles this person piloted */
  vehicles: z.array(z.string().url()),
  /** URLs of starships this person piloted */
  starships: z.array(z.string().url()),
  /** ISO 8601 creation timestamp */
  created: z.string(),
  /** ISO 8601 last-edit timestamp */
  edited: z.string(),
  /** Canonical URL of this resource */
  url: z.string().url(),
});

export type Person = z.infer<typeof PersonSchema>;

/** Extract the numeric ID from the resource URL. */
export function getResourceId(url: string): number {
  return parseInt(url.replace(/\/$/, "").split("/").at(-1)!, 10);
}
