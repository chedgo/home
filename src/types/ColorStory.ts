import { z } from 'zod';

export const colorStorySchema = z.object({
  text: z.string().describe('A short story about the color'),
});
export type PartialColorStory = Partial<z.infer<typeof colorStorySchema>>;

export type ColorStory = z.infer<typeof colorStorySchema>;
