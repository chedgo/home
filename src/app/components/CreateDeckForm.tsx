import React, { useState, useCallback } from 'react';
import { Deck } from '../../types';

interface CreateDeckFormProps {
  onCreateDeck: (deck: Deck) => void;
}

export function CreateDeckForm({ onCreateDeck }: CreateDeckFormProps) {
  const [newDeckName, setNewDeckName] = useState('');
  const [newDeckAddress, setNewDeckAddress] = useState('');
  const [newDeckCoords, setNewDeckCoords] = useState({ lat: 0, lon: 0 });
  const [suggestions, setSuggestions] = useState<any[]>([]);

  const handleNewDeckSuggestionSelect = useCallback((suggestion: any) => {
    setNewDeckAddress(suggestion.display_name);
    setNewDeckCoords({
      lat: parseFloat(suggestion.lat),
      lon: parseFloat(suggestion.lon),
    });
    setSuggestions([]);
  }, []);

  const handleCreateDeck = useCallback(() => {
    if (newDeckName && newDeckAddress) {
      onCreateDeck({
        id: Date.now().toString(),
        name: newDeckName,
        locations: [],
        address: newDeckAddress,
        coords: newDeckCoords
      });
      setNewDeckName('');
      setNewDeckAddress('');
      setNewDeckCoords({ lat: 0, lon: 0 });
    }
  }, [newDeckName, newDeckAddress, newDeckCoords, onCreateDeck]);

  const handleAddressChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setNewDeckAddress(e.target.value);
    if (e.target.value.length > 2) {
      fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(e.target.value)}&countrycodes=us&limit=10`)
        .then(response => response.json())
        .then(data => {
          // Prioritize USA results
          const usResults = data.filter((item: any) => item.address?.country_code === 'us');
          const otherResults = data.filter((item: any) => item.address?.country_code !== 'us');
          const combinedResults = [...usResults, ...otherResults];
          setSuggestions(combinedResults);
        })
        .catch(error => console.error('Error fetching suggestions:', error));
    } else {
      setSuggestions([]);
    }
  }, []);

  // Add this near the top of your component
  console.log('Rendering with suggestions:', suggestions);

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
          onChange={handleAddressChange}
          placeholder="Deck Location"
          className="w-full p-2 border rounded"
        />
        {suggestions.length > 0 && (
          <ul className="absolute z-50 w-full mt-1 bg-white border rounded shadow-lg max-h-60 overflow-y-auto">
            {suggestions.map((suggestion, index) => (
              <li
                key={index}
                onClick={() => handleNewDeckSuggestionSelect(suggestion)}
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