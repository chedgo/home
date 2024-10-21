import { Coordinates } from '@/types';
import {
  destinationSchema,
  partialDestination,
} from '@/app/api/locations/schema';
import { useCallback } from 'react';
import { experimental_useObject as useObject } from 'ai/react';

export function useFetchDestinations() {
  const { submit, isLoading, object } = useObject<{
    destinations: partialDestination[];
  }>({
    api: '/api/locations',
    schema: destinationSchema,
  });

  const fetchDestinations = useCallback(
    (coords: Coordinates, activities: string[], maxDistance: number) => {
      if (!coords || activities.length === 0 || maxDistance === 0) {
        return;
      }

      submit({
        latitude: coords.lat,
        longitude: coords.lon,
        activities: activities.join(','),
        maxDistance,
      });
    },
    [submit]
  );

  return {
    fetchDestinations,
    isLoading,
    destinations: object?.destinations || [],
  };
}
