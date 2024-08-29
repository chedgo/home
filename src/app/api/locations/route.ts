import { NextRequest, NextResponse } from 'next/server'
import OpenAI from 'openai'

type Location = {
  name: string
  description: string
  wikipedia_link: string | null
  latitude: number
  longitude: number
}

type ResponseData = {
  locations: Location[]
}

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const latitude = searchParams.get('latitude')
    const longitude = searchParams.get('longitude')

    if (!latitude || !longitude) {
      return NextResponse.json({ locations: [] }, { status: 400 })
    }

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [{ role: "user", content: `Find 20 interesting photo locations near ${latitude}, ${longitude}.` }],
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
    });

    const functionCall = completion.choices[0].message.function_call;
    if (functionCall && functionCall.name === "get_photo_locations") {
      const locations: Location[] = JSON.parse(functionCall.arguments || '{}').locations;
      return NextResponse.json({ locations });
    } else {
      return NextResponse.json({ locations: [] }, { status: 500 });
    }
  } catch (error) {
    console.error('Error calling OpenAI:', error)
    return NextResponse.json({ locations: [] }, { status: 500 });
  }
}
