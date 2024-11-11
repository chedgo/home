import { openai } from '@ai-sdk/openai';
import { streamObject } from 'ai';
import { scriptSchema } from '@/types/Interviews';

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
      system: `You’re a professional job coach working with a client to prepare them for an interview.
       Your job is to write a script that the
        interviewer might use to conduct the interview. it should be a conversation between the interviewer
        and the client. The script should be 3-5 minutes long. here are the job post, company profile, and resume:
        \`\`\`${jobPost}\`\`\`
        \`\`\`${companyProfile}\`\`\`
        \`\`\`${resume}\`\`\``,
      schema: scriptSchema,
      prompt: `Write a script for an interview with the following job post: ${jobPost}, company profile: ${companyProfile}, and resume: ${resume}.`,
      maxTokens: 200,
      // onFinish({
      //   object
      // }) {
      //   // you could save to a database here
      // },
    });
    return script.toTextStreamResponse();
  } catch (error) {
    return Response.json({ error: 'Failed to get script' }, { status: 500 });
  }
}
