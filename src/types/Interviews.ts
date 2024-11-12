import { z } from 'zod';

export const questionSchema = z.object({
  text: z.string().describe('The interview question text'),
  assessment: z.string().describe('What this question aims to assess'),
});

export type Question = z.infer<typeof questionSchema>;

export type PartialQuestion = Partial<Question>;

