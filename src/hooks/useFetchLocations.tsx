import { Coordinates, Location } from '@/types';
import { useCallback } from 'react';
import { experimental_useObject as useObject } from 'ai/react';
import { locationSchema } from '@/app/api/locations/schema';

export function useFetchLocations() {
  const { submit, isLoading, object } = useObject<{ locations: Location[] }>({
    api: '/api/locations',
    schema: locationSchema,
  });

  const fetchLocations = useCallback(
    (coordinates: Coordinates, activities: string[], maxDistance: number) => {
      if (!coordinates || activities.length === 0 || maxDistance === 0) {
        return;
      }

      submit({
        latitude: coordinates.lat,
        longitude: coordinates.lon,
        activities: activities.join(','),
        maxDistance,
      });
    },
    [submit]
  );

  return { fetchLocations, isLoading, locations: object?.locations || [] };
}
