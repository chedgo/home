'use client';
import React from 'react';
import useLocalStorage from '../../hooks/useLocalStorage';
import chicagoNeighborhoods from '../chicago_neighborhoods.json';
import { Deck } from '../../types';
import PlacePicker from './PlacePicker';

export default function LetsGo() {
  const [decks, setDecks] = useLocalStorage<Deck[]>('userDecks', []);

  const handleUseDefaultDeck = () => {
    const defaultDeck: Deck = {
      name: "Chicago Neighborhoods",
      locations: chicagoNeighborhoods.map(location => ({
        ...location,
        isHidden: false,
        snoozedUntil: undefined,
        wikipedia_link: location.wikipedia_link || null
      })),
      address: "Chicago, IL",
      coords: { lat: 41.8781, lon: -87.6298 }, // Chicago's coordinates
    };
    setDecks([defaultDeck]);
  };

  return (
    <div className="p-6 w-full">
      <div className="mb-6 w-full">
        <h1 className="text-2xl font-bold mb-2 w-full flex justify-center text-primary">
          Let&apos;s Go
        </h1>
        <p className="text-primary">
          This tool was made to help decide where to go take photos when we
          can&apos;t decide. The vision is that the list of locations is
          generated taking into account user preferences and provides some
          customization options. It allows the user to react to cards as they
          go, and stores changes. This tool is not complete, but is already
          useful for me so I thought I&apos;d share as I build it out.
        </p>
      </div>
      
      <PlacePicker decks={decks} setDecks={setDecks} handleUseDefaultDeck={handleUseDefaultDeck} />
    </div>
  );
}
