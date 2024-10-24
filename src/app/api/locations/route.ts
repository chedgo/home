import { openai } from '@ai-sdk/openai';
import { streamObject } from 'ai';
import { destinationSchema } from '../../../types/Destination';

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
    const destinations = await streamObject({
      model: openai('gpt-4o-mini'),
      system: `You are a hyper local travel guide who loves to find unique and interesting destinations for people to visit.`,
      schema: destinationSchema,
      prompt: `Find 10 unique and interesting destinations within ${maxDistance} miles of ${latitude}, ${longitude} in which that one or more of the following activities are appropriate: ${activities}.`,
      // onFinish({
      //   object
      // }) {
      //   // you could save the expense to a database here
      // },
    });
    return destinations.toTextStreamResponse();
  } catch (error) {
    return new Response(
      JSON.stringify({ error: 'Failed to get destinations' }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  }
}
