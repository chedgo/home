import { OpenAIStream, StreamingTextResponse } from 'ai'
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

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const latitude = searchParams.get('latitude')
  const longitude = searchParams.get('longitude')

  if (!latitude || !longitude) {
    return new Response(JSON.stringify({ error: 'Missing latitude or longitude' }), { status: 400 })
  }

  const response = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    // stream: true, // Commented out for now
    messages: [{ role: "user", content: `Find 3 interesting photo locations near ${latitude}, ${longitude}.` }],
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

  // Commented out streaming code
  // const stream = OpenAIStream(response)
  // return new StreamingTextResponse(stream)

  // Non-streaming response
  const functionCall = response.choices[0].message.function_call;
  if (functionCall && functionCall.name === "get_photo_locations") {
    const locations: Location[] = JSON.parse(functionCall.arguments || '{}').locations;
    return new Response(JSON.stringify({ locations }), {
      headers: { 'Content-Type': 'application/json' }
    });
  } else {
    return new Response(JSON.stringify({ error: 'Failed to get locations' }), { 
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}
