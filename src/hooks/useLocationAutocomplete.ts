import { useState, useCallback } from 'react';

interface Suggestion {
  display_name: string;
  lat: string;
  lon: string;
  address?: {
    country_code: string;
  };
}

interface Coordinates {
  lat: number;
  lon: number;
}

export function useLocationAutocomplete() {
  const [address, setAddress] = useState('');
  const [coords, setCoords] = useState<Coordinates>({ lat: 0, lon: 0 });
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);

  const handleAddressChange = useCallback((value: string) => {
    setAddress(value);
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
    setAddress(suggestion.display_name);
    setCoords({
      lat: parseFloat(suggestion.lat),
      lon: parseFloat(suggestion.lon),
    });
    setSuggestions([]);
  }, []);

  return {
    address,
    coords,
    suggestions,
    handleAddressChange,
    handleSuggestionSelect,
  };
}
