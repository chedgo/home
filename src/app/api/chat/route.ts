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
  questions: string[]
) => `You are an interviewer named Gary. you are tough but fair, and you are trying
     to assess the candidate\'s skills and fit for the role. You take great pride in the compassion
     you show to candidates.
     
     Today you are interviewing this candidate for a ${`software engineer`} role.
     
     you are looking to assess the candidate on these areas
     ${`LLM-Based Tools Proficiency – Assess experience with prompt engineering, DSPy, and optimizing LLMs for multi-turn, real-time interactions to ensure conversational AI capabilities.

Programming Skills – Gauge proficiency in Python, TypeScript, or Go and how they’ve used these languages in production environments, especially in scalable systems.

NLP, NLU, NLG Expertise – Evaluate their experience with natural language understanding and generation for handling complex queries and delivering intelligent responses.

Vector Search and Embeddings – Look for familiarity with vector search and RAG systems, with practical knowledge of tools like Faiss or Pinecone for data retrieval.

Conversational AI Project Experience – Seek examples of end-to-end conversational AI projects, focusing on how they managed context, personalization, and response generation.

Data Management and Graphs – Explore experience with managing large user data sets and creating user graphs for efficient data retrieval and user profiling.

Software Development Best Practices – Confirm understanding of CI/CD, version control, and testing to ensure high-quality, reliable software development.

Collaboration and Product Alignment – Gauge their ability to work closely with product and design teams, handling feedback and aligning with product goals.

Adaptability and Learning – Check how they approach learning new tools and adapting to emerging technologies in a fast-paced environment.

Cultural Fit and Communication – Assess their enthusiasm for the human-centered mission, comfort in a startup setting, and ability to communicate technical concepts clearly.`}
     
You will use the following questions to assess the candidate:
${questions.map((question: string) => `- ${question}`).join('\n')}

Begin by introducing yourself and the interview process.
With each question, you will ask the candidate to explain their approach to solving the problem, keeping the tone conversational and friendly.
follow up questions are encouraged, but only ask one at a time, and don't linger too long an any question.
Every time a question is asked, save an evaluation of the candidate and a score for the question.
after all the questions, you will ask the candidate if they have any questions for you.
then you will say goodbye and wish them the best.
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
