import { Place } from '@/types';
import { useState, useCallback, useEffect } from 'react';
import { useDebounce } from 'use-debounce';

interface LocationAutocompleteProps {
  defaultLocation: Place;
}

export function useLocationAutocomplete({
  defaultLocation,
}: LocationAutocompleteProps) {
  const [inputValue, setInputValue] = useState<string>(
    defaultLocation.display_name
  );
  const [debouncedInputValue] = useDebounce(inputValue, 300); // Debounce for 300ms
  const [selectedLocation, setSelectedLocation] = useState<Place | null>(
    defaultLocation
  );
  const [suggestions, setSuggestions] = useState<Place[]>([]);
  const [isSelecting, setIsSelecting] = useState<boolean>(true);

  const handleInputValueChange = useCallback(
    (value: string) => {
      setInputValue(value);
      if (isSelecting) {
        setIsSelecting(false);
      }
    },
    [isSelecting]
  );

  useEffect(() => {
    if (debouncedInputValue.length > 2 && !isSelecting) {
      const params = new URLSearchParams({
        format: 'json',
        countrycodes: 'us',
        limit: '10',
        q: debouncedInputValue,
      });

      fetch(`https://nominatim.openstreetmap.org/search?${params}`)
        .then((response) => response.json())
        .then((data) => {
          const municipalityResults = data.filter(
            (item: Place) =>
              item.addresstype === 'town' ||
              item.addresstype === 'village' ||
              item.addresstype === 'city'
          );
          setSuggestions(municipalityResults);
        })
        .catch((error) => console.error('Error fetching suggestions:', error));
    } else {
      setSuggestions([]);
    }
  }, [debouncedInputValue, isSelecting]);

  const handleSuggestionSelect = useCallback((suggestion: Place) => {
    setIsSelecting(true);
    setInputValue(suggestion.display_name);
    setSelectedLocation({
      display_name: suggestion.display_name,

      lat: suggestion.lat,
      lon: suggestion.lon,
    });
    setSuggestions([]);
  }, []);

  return {
    inputValue,
    setInputValue: handleInputValueChange,
    location: selectedLocation,
    suggestions,
    clearSuggestions: () => setSuggestions([]),
    handleSuggestionSelect,
  };
}
