import React, { useState, KeyboardEvent } from 'react';
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
  const [selectedIndex, setSelectedIndex] = useState<number>(-1);

  const handleSelect = (suggestion: Suggestion) => {
    handleSuggestionSelect(suggestion);
    setLocation({
      name: suggestion.display_name,
      coords: {
        lat: parseFloat(suggestion.lat),
        lon: parseFloat(suggestion.lon),
      },
    });
    setSelectedIndex(-1);
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (suggestions.length === 0) return;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setSelectedIndex((prevIndex) =>
          prevIndex < suggestions.length - 1 ? prevIndex + 1 : prevIndex
        );
        break;
      case 'ArrowUp':
        e.preventDefault();
        setSelectedIndex((prevIndex) => (prevIndex > 0 ? prevIndex - 1 : 0));
        break;
      case 'Enter':
        e.preventDefault();
        if (selectedIndex >= 0 && selectedIndex < suggestions.length) {
          handleSelect(suggestions[selectedIndex]);
        }
        break;
    }
  };

  return (
    <div className="relative">
      <input
        type="text"
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Location"
        className="w-full p-2 border rounded"
      />
      {suggestions.length > 0 && (
        <ul className="absolute z-50 w-full mt-1 bg-white border rounded shadow-lg max-h-60 overflow-y-auto">
          {suggestions.map((suggestion, index) => (
            <li
              key={index}
              onClick={() => handleSelect(suggestion)}
              className={`p-2 hover:bg-gray-100 cursor-pointer ${
                index === selectedIndex ? 'bg-gray-200' : ''
              }`}
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
