import { Coordinates, Location } from '@/types';
import { useCallback, useState } from 'react';

export function useFetchLocations() {
  const [isLoading, setIsLoading] = useState(false);
  const [locations, setLocations] = useState<Location[]>([]);
  const fetchLocations = useCallback(
    async (
      coordinates: Coordinates,
      activities: string[],
      maxDistance: number
    ) => {
      if (!coordinates || activities.length === 0 || maxDistance === 0) {
        return;
      }

      setIsLoading(true);
      try {
        const response = await fetch(
          `/api/locations?latitude=${coordinates.lat}&longitude=${
            coordinates.lon
          }&activities=${activities.join(',')}&maxDistance=${maxDistance}`
        );
        if (!response.ok) {
          throw new Error('Failed to fetch locations');
        }
        const data = await response.json();
        setLocations(data.locations);
      } catch (error) {
        console.error('Error fetching locations:', error);
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  return { fetchLocations, isLoading, locations };
}
