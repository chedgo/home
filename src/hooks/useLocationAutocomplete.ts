import { Location } from '@/types';
import { useState, useCallback, useEffect } from 'react';
import { useDebounce } from 'use-debounce';

export interface Suggestion {
  display_name: string;
  lat: string;
  lon: string;
  address?: {
    country_code: string;
    city?: string;
    town?: string;
    village?: string;
  };
  addresstype?: string;
}

interface LocationAutocompleteProps {
  defaultLocation: Location;
}

export function useLocationAutocomplete({ defaultLocation }: LocationAutocompleteProps) {
  const [inputValue, setInputValue] = useState<string>(defaultLocation.name);
  const [debouncedInputValue] = useDebounce(inputValue, 300); // Debounce for 300ms
  const [location, setLocation] = useState<Location | null>(defaultLocation);
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [isSelecting, setIsSelecting] = useState<boolean>(false);

  const handleInputValueChange = useCallback((value: string) => {
    setInputValue(value);
    if (isSelecting) {
      setIsSelecting(false);
    }
  }, [isSelecting]);

  useEffect(() => {
    if (debouncedInputValue.length > 2 && !isSelecting) {
      const params = new URLSearchParams({
        format: 'json',
        countrycodes: 'us',
        limit: '10',
        q: debouncedInputValue,
      });

      fetch(`https://nominatim.openstreetmap.org/search?${params}`)
        .then(response => response.json())
        .then(data => {
          const municipalityResults = data.filter((item: Suggestion) => 
            item.addresstype === 'town' || item.addresstype === 'village' || item.addresstype === 'city'
          );
          setSuggestions(municipalityResults);
        })
        .catch(error => console.error('Error fetching suggestions:', error));
    } else {
      setSuggestions([]);
    }
  }, [debouncedInputValue, isSelecting]);

  const handleSuggestionSelect = useCallback((suggestion: Suggestion) => {
    setIsSelecting(true);
    setInputValue(suggestion.display_name);
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
    setInputValue: handleInputValueChange,
    location,
    suggestions,
    clearSuggestions: () => setSuggestions([]),
    handleSuggestionSelect,
  };
}
