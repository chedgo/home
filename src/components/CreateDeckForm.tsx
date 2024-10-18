import React, { useState, useCallback } from 'react';
import { Deck } from '../types';
import LocationAutocomplete from './LocationAutocomplete';
import { DEFAULT_LOCATION } from '@/constants/locations';
import { Location } from '@/types';
interface CreateDeckFormProps {
  onCreateDeck: (deck: Deck) => void;
}

export function CreateDeckForm({ onCreateDeck }: CreateDeckFormProps) {
  const [newDeckName, setNewDeckName] = useState('');
  const [newDeckAddress, setNewDeckAddress] = useState('');
  const [newDeckCoords, setNewDeckCoords] = useState({ lat: 0, lon: 0 });
  const [selectedLocation, setSelectedLocation] = useState<Location>(DEFAULT_LOCATION);


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
      setNewDeckAddress('');
      setNewDeckCoords({ lat: 0, lon: 0 });
    }
  }, [newDeckName, newDeckAddress, newDeckCoords, onCreateDeck]);

  return (
    <div>
      <input
        type="text"
        value={newDeckName}
        onChange={(e) => setNewDeckName(e.target.value)}
        placeholder="Deck Name"
        className="w-full p-2 border rounded mb-2"
      />
      <LocationAutocomplete location={selectedLocation} setLocation={setSelectedLocation} />
      <button
        onClick={handleCreateDeck}
        className="mt-4 p-2 bg-blue-600 text-white rounded w-full"
      >
        Create Deck
      </button>
    </div>
  );
}
