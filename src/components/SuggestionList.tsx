import React from 'react';
import { Place } from '@/types/Place';

interface SuggestionListProps {
  suggestions: Place[];
  selectedIndex: number;
  onSelect: (suggestion: Place) => void;
}

const SuggestionList: React.FC<SuggestionListProps> = ({
  suggestions,
  selectedIndex,
  onSelect,
}) => {
  if (suggestions.length === 0) return null;

  return (
    <ul className="absolute z-50 w-full mt-1 bg-white border rounded shadow-lg max-h-60 overflow-y-auto">
      {suggestions.map((suggestion, index) => (
        <li
          key={index}
          onClick={() => onSelect(suggestion)}
          className={`p-2 hover:bg-gray-100 cursor-pointer ${
            index === selectedIndex ? 'bg-gray-200' : ''
          }`}
        >
          {suggestion.display_name || 'Unknown location'}
        </li>
      ))}
    </ul>
  );
};

export default SuggestionList;
