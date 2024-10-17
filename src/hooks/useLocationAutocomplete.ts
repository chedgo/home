import { Location } from '@/types';
import { useState, useCallback } from 'react';

interface Suggestion {
  display_name: string;
  lat: string;
  lon: string;
  address?: {
    country_code: string;
  };
}

interface LocationAutocompleteProps {
  defaultLocation: Location;
}


export function useLocationAutocomplete({ defaultLocation }: LocationAutocompleteProps) {
  const [inputValue, setInputValue] = useState<string>(defaultLocation.name);
  const [location, setLocation] = useState<Location | null>(defaultLocation);
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);

  const handleAddressChange = useCallback((value: string) => {
    setInputValue(value);
    if (value.length > 2) {
      fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(value)}&countrycodes=us&limit=10`)
        .then(response => response.json())
        .then(data => {
          // Prioritize USA results
          const usResults = data.filter((item: Suggestion) => item.address?.country_code === 'us');
          const otherResults = data.filter((item: Suggestion) => item.address?.country_code !== 'us');
          const combinedResults = [...usResults, ...otherResults];
          setSuggestions(combinedResults);
        })
        .catch(error => console.error('Error fetching suggestions:', error));
    } else {
      setSuggestions([]);
    }
  }, []);

  const handleSuggestionSelect = useCallback((suggestion: Suggestion) => {
    setLocation({
      name: suggestion.display_name,
      coords: {
        lat: parseFloat(suggestion.lat),
        lon: parseFloat(suggestion.lon),
      },
      description: '',
      wikipedia_link: '',
    });
    setSuggestions([]);
  }, []);

  return {
    inputValue,
    setInputValue: handleAddressChange,
    location,
    suggestions,
    handleSuggestionSelect,
  };
}
