import { z } from 'zod';

export const questionListSchema = z.object({
  questions: z.array(z.string()).describe('The list of interview questions'),
});

export type partialQuestionListSchema = Partial<
  z.infer<typeof questionListSchema>
>;
