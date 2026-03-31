/** Zod schema for the SWAPI Vehicles resource. */
import { z } from "zod";

export const VehicleSchema = z.object({
  /** The name of this vehicle */
  name: z.string(),
  /** The model or official name */
  model: z.string(),
  /** Comma-separated list of manufacturers */
  manufacturer: z.string(),
  /** Cost in galactic credits, or 'unknown' */
  cost_in_credits: z.string(),
  /** Length in meters */
  length: z.string(),
  /** Max speed in atmosphere, or 'n/a' */
  max_atmosphering_speed: z.string(),
  /** Number of crew required to operate */
  crew: z.string(),
  /** Number of non-crew passengers */
  passengers: z.string(),
  /** Max cargo capacity in kilograms */
  cargo_capacity: z.string(),
  /** Max time consumables last for crew */
  consumables: z.string(),
  /** Class such as wheeled or repulsorcraft */
  vehicle_class: z.string(),
  /** URLs of people who piloted this vehicle */
  pilots: z.array(z.string().url()),
  /** URLs of films featuring this vehicle */
  films: z.array(z.string().url()),
  /** ISO 8601 creation timestamp */
  created: z.string(),
  /** ISO 8601 last-edit timestamp */
  edited: z.string(),
  /** Canonical URL of this resource */
  url: z.string().url(),
});

export type Vehicle = z.infer<typeof VehicleSchema>;
