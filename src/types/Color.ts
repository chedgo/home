import { z } from 'zod';

export const colorSchema = z.object({
  name: z.string(),
  hex: z.string(),
  red: z.number(),
  green: z.number(),
  blue: z.number(),
  hue: z.number(),
  saturation: z.number(),
  value: z.number(),
});
export type Color = z.infer<typeof colorSchema>;

