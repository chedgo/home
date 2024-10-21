import OpenAI from 'openai';
import { openai } from '@ai-sdk/openai';
import { streamText, convertToCoreMessages, streamObject } from 'ai';
import { locationSchema } from './schema';

type Location = {
  name: string;
  description: string;
  wikipedia_link: string | null;
  latitude: number;
  longitude: number;
  isHidden?: boolean;
  snoozedUntil?: number;
};
export const runtime = 'edge';
export const maxDuration = 30;

// const openai = new OpenAI({
//   apiKey: process.env.OPENAI_API_KEY!,
// })

// function isLocationUnique(newLocation: Location, existingLocations: Location[]): boolean {
//   return !existingLocations.some(existing =>
//     existing.name === newLocation.name ||
//     (Math.abs(existing.latitude - newLocation.latitude) < 0.001 &&
//      Math.abs(existing.longitude - newLocation.longitude) < 0.001)
//   );
// }

async function generateLocation(
  latitude: string,
  longitude: string,
  index: number
): Promise<Location | null> {
  const prompts = [
    `Find 1 unique and interesting photo location near ${latitude}, ${longitude}. Focus on natural landmarks or scenic viewpoints.`,
    `Identify 1 unique photo spot near ${latitude}, ${longitude}. Prioritize historical or cultural sites.`,
    `Discover 1 distinctive photography location around ${latitude}, ${longitude}. Consider urban or architectural points of interest.`,
  ];

  // const response = await openai.chat.completions.create({
  //   model: 'gpt-4o-mini',
  //   messages: [
  //     {
  //       role: 'user',
  //       content: `${prompts[index]}`,
  //     },
  //   ],
  //   functions: [
  //     {
  //       name: 'get_photo_locations',
  //       description: 'Get a list of interesting photo locations',
  //       parameters: {
  //         type: 'object',
  //         properties: {
  //           locations: {
  //             type: 'array',
  //             items: {
  //               type: 'object',
  //               properties: {
  //                 name: { type: 'string' },
  //                 description: { type: 'string' },
  //                 wikipedia_link: { type: 'string', nullable: true },
  //                 latitude: { type: 'number' },
  //                 longitude: { type: 'number' },
  //               },
  //               required: [
  //                 'name',
  //                 'description',
  //                 'wikipedia_link',
  //                 'latitude',
  //                 'longitude',
  //               ],
  //             },
  //           },
  //         },
  //         required: ['locations'],
  //       },
  //     },
  //   ],
  //   function_call: { name: 'get_photo_locations' },
  // });

  //   const functionCall = response.choices[0].message.function_call;
  //   if (functionCall && functionCall.name === 'get_photo_locations') {
  //     const locations: Location[] = JSON.parse(
  //       functionCall.arguments || '{}'
  //     ).locations;
  //     return locations[0] || null;
  //   }
  //   return null;
  // }
  return null;
}
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const latitude = searchParams.get('latitude');
  const longitude = searchParams.get('longitude');
  const maxDistance = searchParams.get('maxDistance');
  const activities = searchParams.get('activities');

  if (!latitude || !longitude || !maxDistance || !activities) {
    return new Response(
      JSON.stringify({ error: 'Missing required parameters' }),
      { status: 400 }
    );
  }

  // const generateLocations = async (): Promise<Location[]> => {
  //   const maxAttempts = 2;
  //   const attempts = Array(3)
  //     .fill(0)
  //     .map((_, i) => i);

  //   const generateWithRetry = async (
  //     index: number
  //   ): Promise<Location | null> => {
  //     for (let attempt = 0; attempt <= maxAttempts; attempt++) {
  //       const location = await generateLocation(latitude!, longitude!, index);
  //       if (location) {
  //         return location;
  //       }
  //     }
  //     return null;
  //   };

  //   const uniqueLocations = await Promise.all(attempts.map(generateWithRetry));
  //   return uniqueLocations.filter(
  //     (location): location is Location => location !== null
  //   );
  // };

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
    return locations.toTextStreamResponse()
  } catch (error) {
    return new Response(JSON.stringify({ error: 'Failed to get locations' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
