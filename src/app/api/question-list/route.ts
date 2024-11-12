import { openai } from '@ai-sdk/openai';
import { streamObject } from 'ai';
import { questionSchema } from '@/types/Interviews';

export const runtime = 'edge';
export const maxDuration = 30;

export async function POST(req: Request) {
  const { jobPost, companyProfile, resume } = await req.json();

  if (!jobPost || !companyProfile || !resume) {
    return new Response(
      JSON.stringify({ error: 'Missing required parameters' }),
      { status: 400 }
    );
  }
  try {
    const script = await streamObject({
      model: openai('gpt-4o-mini'),
      system: `You’re a professional job coach working with a client to prepare them for an interview.`,
      schema: questionSchema,
      prompt: `Write a list of questions that the interviewer might use to conduct the interview.
       Aim for 10 questions ranging from general cultural questions to technical questions, especially
       focusing on the skills and experience outlined in the resume and job post. here are the job post,
       company profile, and resume:
       \`\`\`${jobPost}\`\`\`
       \`\`\`${companyProfile}\`\`\`
       \`\`\`${resume}\`\`\``,
      maxTokens: 200,
      // onFinish({
      //   object
      // }) {
      //   // you could save to a database here
      // },
    });
    return script.toTextStreamResponse();
  } catch (error) {
    return Response.json({ error: 'Failed to get questions' }, { status: 500 });
  }
}
