import React from 'react';
import { Deck } from '../types';

type DeckSelectorProps = {
  decks: Deck[];
  currentDeckIndex: number;
  onDeckChange: (index: number) => void;
};

export function DeckSelector({ decks, currentDeckIndex, onDeckChange }: DeckSelectorProps) {
  return (
    <div className="mb-4">
      <label htmlFor="deck-select" className="block text-sm font-medium text-gray-700 mb-2">
        Select a Deck:
      </label>
      <select
        id="deck-select"
        value={currentDeckIndex}
        onChange={(e) => onDeckChange(Number(e.target.value))}
        className="w-full p-2 border rounded"
      >
        {decks.map((deck, index) => (
          <option key={index} value={index}>{deck.name}</option>
        ))}
      </select>
    </div>
  );
}