import { z } from 'zod';

export const scriptSchema = z.object({
  script: z.string().describe('The script for the interview'),
});

export type partialScriptSchema = Partial<z.infer<typeof scriptSchema>>;
