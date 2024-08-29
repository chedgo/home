// import { OpenAIStream, StreamingTextResponse } from 'ai'
import OpenAI from 'openai'

type Location = {
  name: string
  description: string
  wikipedia_link: string | null
  latitude: number
  longitude: number
}
export const runtime = 'edge'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY!,
})

function isLocationUnique(newLocation: Location, existingLocations: Location[]): boolean {
  return !existingLocations.some(existing => 
    existing.name === newLocation.name ||
    (Math.abs(existing.latitude - newLocation.latitude) < 0.001 &&
     Math.abs(existing.longitude - newLocation.longitude) < 0.001)
  );
}

async function generateLocation(latitude: string, longitude: string, excludeLocations: Location[], index: number): Promise<Location | null> {
  const prompts = [
    `Find 1 unique and interesting photo location near ${latitude}, ${longitude}. Focus on natural landmarks or scenic viewpoints.`,
    `Identify 1 unique photo spot near ${latitude}, ${longitude}. Prioritize historical or cultural sites.`,
    `Discover 1 distinctive photography location around ${latitude}, ${longitude}. Consider urban or architectural points of interest.`
  ];

  const response = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
      { 
        role: "user", 
        content: `${prompts[index]} Ensure it has distinct coordinates. Exclude these previously generated locations: ${JSON.stringify(excludeLocations)}.` 
      }
    ],
    functions: [
      {
        name: "get_photo_locations",
        description: "Get a list of interesting photo locations",
        parameters: {
          type: "object",
          properties: {
            locations: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  name: { type: "string" },
                  description: { type: "string" },
                  wikipedia_link: { type: "string", nullable: true },
                  latitude: { type: "number" },
                  longitude: { type: "number" },
                },
                required: ["name", "description", "wikipedia_link", "latitude", "longitude"],
              },
            },
          },
          required: ["locations"],
        },
      },
    ],
    function_call: { name: "get_photo_locations" },
  })

  const functionCall = response.choices[0].message.function_call;
  if (functionCall && functionCall.name === "get_photo_locations") {
    const locations: Location[] = JSON.parse(functionCall.arguments || '{}').locations;
    return locations[0] || null;
  }
  return null;
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const latitude = searchParams.get('latitude')
  const longitude = searchParams.get('longitude')
  const previousLocations = searchParams.get('previousLocations')

  if (!latitude || !longitude) {
    return new Response(JSON.stringify({ error: 'Missing latitude or longitude' }), { status: 400 })
  }

  const parsedPreviousLocations: Location[] = previousLocations ? JSON.parse(previousLocations) : []

  const generateUniqueLocations = async (): Promise<Location[]> => {
    const maxAttempts = 2;
    const attempts = Array(3).fill(0).map((_, i) => i);

    const generateWithRetry = async (index: number): Promise<Location | null> => {
      for (let attempt = 0; attempt <= maxAttempts; attempt++) {
        const location = await generateLocation(latitude!, longitude!, parsedPreviousLocations, index);
        if (location && isLocationUnique(location, parsedPreviousLocations)) {
          return location;
        }
      }
      return null;
    };

    const uniqueLocations = await Promise.all(attempts.map(generateWithRetry));
    return uniqueLocations.filter((location): location is Location => location !== null);
  };

  try {
    const uniqueLocations = await generateUniqueLocations();
    return new Response(JSON.stringify({ locations: uniqueLocations }), {
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: 'Failed to get locations' }), { 
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}
