import React from 'react';
import { useLocationAutocomplete } from '../hooks/useLocationAutocomplete';

interface LocationAutocompleteProps {
  onLocationSelect: (
    address: string,
    coords: { lat: number; lon: number }
  ) => void;
}

const LocationAutocomplete = ({
  onLocationSelect,
}: LocationAutocompleteProps) => {
  const {
    address,
    coords,
    suggestions,
    handleAddressChange,
    handleSuggestionSelect,
  } = useLocationAutocomplete();

  const handleSelect = (suggestion: any) => {
    handleSuggestionSelect(suggestion);
    onLocationSelect(suggestion.display_name, {
      lat: parseFloat(suggestion.lat),
      lon: parseFloat(suggestion.lon),
    });
  };

  return (
    <div className="relative">
      <input
        type="text"
        value={address}
        onChange={(e) => handleAddressChange(e.target.value)}
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
