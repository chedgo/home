import OpenAI from 'openai';

export async function checkModeration(content: string) {
  const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  });
  const moderation = await openai.moderations.create({
    model: 'omni-moderation-latest',
    input: content,
  });

  return moderation.results[0].flagged;
} 