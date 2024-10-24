import { z } from 'zod';

export const destinationSchema = z.object({
  destinations: z.array(
    z.object({
      name: z.string().describe('Name of the destination'),
      description: z.string().describe('Description of the destination'),
      wikipedia_link: z
        .string()
        .nullable()
        .describe('Wikipedia link for the location, if available'),
      coords: z.object({
        lat: z.string().describe('Latitude coordinate of the destination'),
        lon: z.string().describe('Longitude coordinate of the destination'),
      }),
      explanation: z
        .string()
        .describe('Explanation of why the destination is interesting'),
    })
  ),
});

export type partialDestination = Partial<
  z.infer<typeof destinationSchema>['destinations'][number]
>;

export type Destination = z.infer<
  typeof destinationSchema
>['destinations'][number];
