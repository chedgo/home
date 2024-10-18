import React from 'react';
import {
  Suggestion,
  useLocationAutocomplete,
} from '../hooks/useLocationAutocomplete';
import { DEFAULT_LOCATION } from '../constants/locations';
import { Location } from '../types';

interface LocationAutocompleteProps {
  location: Location;
  setLocation: (location: Location) => void;
}

const LocationAutocomplete = ({
  setLocation,
}: LocationAutocompleteProps) => {
  const { inputValue, setInputValue, suggestions, handleSuggestionSelect } = useLocationAutocomplete({
    defaultLocation: DEFAULT_LOCATION,
  });
  console.log('🚀 ~ suggestions:', suggestions);

  const handleSelect = (suggestion: Suggestion) => {
    handleSuggestionSelect(suggestion);
    setLocation({
      name: suggestion.display_name,
      coords: {
        lat: parseFloat(suggestion.lat),
        lon: parseFloat(suggestion.lon),
      },
    });
  };

  return (
    <div className="relative">
      <input
        type="text"
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        placeholder="Location"
        className="w-full p-2 border rounded"
      />
      {suggestions.length > 0 && (
        <ul className="absolute z-50 w-full mt-1 bg-white border rounded shadow-lg max-h-60 overflow-y-auto">
          {suggestions.map((suggestion, index) => (
            <li
              key={index}
              onClick={() => handleSelect(suggestion)}
              className="p-2 hover:bg-gray-100 cursor-pointer"
            >
              {suggestion.display_name || 'Unknown location'}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default LocationAutocomplete;
