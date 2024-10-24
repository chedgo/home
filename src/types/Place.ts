import { z } from 'zod';

export const placeSchema = z.object({
  display_name: z.string(),
  lat: z.string(),
  lon: z.string(),
  address: z
    .object({
      country_code: z.string(),
      city: z.string().optional(),
      town: z.string().optional(),
      village: z.string().optional(),
    })
    .optional(),
  addresstype: z.string().optional(),
});

export type Place = z.infer<typeof placeSchema>;
