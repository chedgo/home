import { z } from 'zod';

export const locationSchema = z.object({
  location: z.object({
    name: z.string().describe('Name of the location'),
    description: z.string().describe('Description of the location'),
    wikipedia_link: z.string().nullable().describe('Wikipedia link for the location, if available'),
    latitude: z.number().describe('Latitude coordinate of the location'),
    longitude: z.number().describe('Longitude coordinate of the location'),
    explanation: z.string().describe('Explanation of why the location is interesting'),
    // isHidden: z.boolean().optional().describe('Whether the location is hidden'),
    // snoozedUntil: z.number().optional().describe('Timestamp until which the location is snoozed'),
  }),
});

export type PartialLocation = Partial<z.infer<typeof locationSchema>['location']>;

export type Location = z.infer<typeof locationSchema>['location'];
