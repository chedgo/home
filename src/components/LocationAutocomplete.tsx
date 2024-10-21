import React, { useEffect, useRef } from 'react';
import { useLocationAutocomplete } from '../hooks/useLocationAutocomplete';
import { useKeyboardNavigation } from '@/hooks/useKeyboardNavigation';
import { DEFAULT_USER_PLACE } from '../constants/locations';
import { Place } from '@/types';
import SuggestionList from '@/components/SuggestionList';

interface LocationAutocompleteProps {
  setSelectedLocation: (location: Place) => void;
}

const LocationAutocomplete: React.FC<LocationAutocompleteProps> = ({
  setSelectedLocation,
}) => {
  const {
    inputValue,
    setInputValue,
    suggestions,
    handleSuggestionSelect,
    clearSuggestions,
  } = useLocationAutocomplete({
    defaultLocation: DEFAULT_USER_PLACE,
  });

  const { selectedIndex, handleKeyDown } = useKeyboardNavigation(
    suggestions.length
  );

  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        wrapperRef.current &&
        !wrapperRef.current.contains(event.target as Node)
      ) {
        clearSuggestions();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [clearSuggestions]);

  const handleSelect = (suggestion: Place) => {
    handleSuggestionSelect(suggestion);
    setSelectedLocation({
      display_name: suggestion.display_name,
      lat: suggestion.lat,
      lon: suggestion.lon,
    });
  };

  return (
    <div className="relative" ref={wrapperRef}>
      <input
        type="text"
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        onKeyDown={(e) =>
          handleKeyDown(e, () => handleSelect(suggestions[selectedIndex]))
        }
        placeholder="Location"
        className="w-full p-2 border rounded"
      />
      <SuggestionList
        suggestions={suggestions}
        selectedIndex={selectedIndex}
        onSelect={handleSelect}
      />
    </div>
  );
};

export default LocationAutocomplete;
