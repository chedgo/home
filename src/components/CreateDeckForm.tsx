import React, { useState, useCallback } from 'react';
import { Deck } from '../types';
import { useLocationAutocomplete } from '../hooks/useLocationAutocomplete';

interface CreateDeckFormProps {
  onCreateDeck: (deck: Deck) => void;
}

export function CreateDeckForm({ onCreateDeck }: CreateDeckFormProps) {
  const [newDeckName, setNewDeckName] = useState('');
  const {
    address: newDeckAddress,
    coords: newDeckCoords,
    suggestions,
    handleAddressChange,
    handleSuggestionSelect,
  } = useLocationAutocomplete();

  const handleCreateDeck = useCallback(() => {
    if (newDeckName && newDeckAddress) {
      onCreateDeck({
        id: Date.now().toString(),
        name: newDeckName,
        locations: [],
        address: newDeckAddress,
        coords: newDeckCoords,
      });
      setNewDeckName('');
      handleAddressChange('');
    }
  }, [
    newDeckName,
    newDeckAddress,
    newDeckCoords,
    onCreateDeck,
    handleAddressChange,
  ]);

  return (
    <div>
      <input
        type="text"
        value={newDeckName}
        onChange={(e) => setNewDeckName(e.target.value)}
        placeholder="Deck Name"
        className="w-full p-2 border rounded mb-2"
      />
      <div className="relative">
        <input
          type="text"
          value={newDeckAddress}
          onChange={(e) => handleAddressChange(e.target.value)}
          placeholder="Deck Location"
          className="w-full p-2 border rounded"
        />
        {suggestions.length > 0 && (
          <ul className="absolute z-50 w-full mt-1 bg-white border rounded shadow-lg max-h-60 overflow-y-auto">
            {suggestions.map((suggestion, index) => (
              <li
                key={index}
                onClick={() => handleSuggestionSelect(suggestion)}
                className="p-2 hover:bg-gray-100 cursor-pointer"
              >
                {suggestion.display_name || 'Unknown location'}
              </li>
            ))}
          </ul>
        )}
      </div>
      <button
        onClick={handleCreateDeck}
        className="mt-4 p-2 bg-blue-600 text-white rounded w-full"
      >
        Create Deck
      </button>
    </div>
  );
}
