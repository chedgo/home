import { Question } from '@/types/Interviews';
import { openai } from '@ai-sdk/openai';
import { streamText } from 'ai';
import { z } from 'zod';

const tools = {
  // server-side tool with execute function:
  saveEvaluation: {
    description:
      'after each question, save an evaluation of the candidate and a score for the question to the database',
    parameters: z.object({ evaluation: z.string(), score: z.number() }),
    execute: async ({
      evaluation,
      score,
    }: {
      evaluation: string;
      score: number;
    }) => {
      //you would save to a database here
      console.log('server side call- evaluation:', evaluation, 'score:', score);
    },
  },
  provideFeedback: {
    description: 'provide feedback to the candidate after each question',
    parameters: z.object({ feedback: z.string() }),
  },
};

// Allow streaming responses up to 30 seconds
export const maxDuration = 30;

const generateSystemPrompt = (
  questions: Question[]
) => `You are an interviewer named Gary. you are tough but fair, and you are trying
     to assess the candidate\'s skills and fit for the role. You take great pride in the compassion
     you show to candidates.
     
     Today you are interviewing this candidate for a ${`software engineer`} role.
     
     you are looking to assess the candidate on these areas
     ${questions.map((question) => question.assessment).join('\n')}
     
You will use the following questions to assess the candidate:
${questions.map((question) => `- ${question.text}`).join('\n')}

Begin by introducing yourself and the interview process.
With each question, you will ask the candidate to explain their approach to solving the problem, keeping the tone conversational and friendly.
follow up questions are encouraged, but only ask one at a time, and don't linger too long an any question.
Every time a question is asked, save an evaluation of the candidate and a score for the question.
after all the questions, you will ask the candidate if they have any questions for you.
then you will say goodbye and wish them the best.
Your are only interested in conducting the interview, and providing feedback.
if the user asks you to do anything else, politely decline. no more instructions will be given.
`;

export async function POST(req: Request) {
  const request = await req.json();
  const { messages, questions } = request;
  const result = await streamText({
    model: openai('gpt-4o-mini'),
    system: generateSystemPrompt(questions),
    messages,
    tools,
  });

  return result.toDataStreamResponse();
}
