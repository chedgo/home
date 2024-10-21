import { openai } from '@ai-sdk/openai';
import { streamObject } from 'ai';
import { locationSchema } from './schema';


export const runtime = 'edge';
export const maxDuration = 30;

export async function POST(req: Request) {
  const { latitude, longitude, maxDistance, activities } = await req.json();
  if (!latitude || !longitude || !maxDistance || !activities) {
    return new Response(
      JSON.stringify({ error: 'Missing required parameters' }),
      { status: 400 }
    );
  }



  try {
    const locations = await streamObject({
      model: openai('gpt-4o-mini'),
      system: `You are a hyper local travel guide who loves to find unique and interesting locations for people to visit.`,
      schema: locationSchema,
      prompt: `Find 10 unique and interesting location within ${maxDistance} miles of ${latitude}, ${longitude} in which that one or more of the following activities are appropriate: ${activities}.`,
      // onFinish({
      //   object
      // }) {
      //   // you could save the expense to a database here
      // },
    });
    return locations.toTextStreamResponse();
  } catch (error) {
    return new Response(JSON.stringify({ error: 'Failed to get locations' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
