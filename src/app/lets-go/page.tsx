'use client';
import React from 'react';
// import useLocalStorage from '../../hooks/useLocalStorage';
// import chicagoNeighborhoods from '../chicago_neighborhoods.json';
// import { Deck } from '../../types';
// import PlacePicker from './PlacePicker';
import LocationAutocomplete from '@/components/LocationAutocomplete';

export default function LetsGo() {
  // const [decks, setDecks] = useLocalStorage<Deck[]>('userDecks', []);
  // const [location, setLocation] = useState<Location | null>(null);

  // const handleUseDefaultDeck = () => {
  //   const defaultDeck: Deck = {
  //     name: 'Chicago Neighborhoods',
  //     id: 'chicago-neighborhoods',
  //     locations: chicagoNeighborhoods.map((location) => ({
  //       ...location,
  //       coords: { lat: location.latitude, lon: location.longitude },
  //       isHidden: false,
  //       snoozedUntil: undefined,
  //       wikipedia_link: location.wikipedia_link || null,
  //     })),
  //     address: 'Chicago, IL',
  //     coords: { lat: 41.8781, lon: -87.6298 }, // Chicagos coordinates
  //   };
  //   setDecks([defaultDeck]);
  // };

  const handleLocationSelect = () => {
    // setLocation(address);
  };

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold mb-6 text-center text-primary">
        Let&apos;s Go
      </h1>
      
      <section className="mb-8 space-y-4 text-primary">
        <p>
          Sometimes you just want to go somewhere and don&apos;t know where to go.
          Sometimes we get caught wandering around the blockbuster longer than a
          movie&apos;s runtime. Sometimes being able to do everything makes it hard
          to do anything.
        </p>
        <p>
          This tool was made to help make a choice and{' '}
          <span className="text-accent font-bold font-tenon-bold">
            move on with your life
          </span>.
        </p>
        <p>
          A user can generate a deck of locations based on their preferences and
          then use the picker to randomly select a{' '}
          <span className="text-accent font-bold font-tenon-bold">
            single location
          </span>{' '}
          from the deck.
        </p>
        <p className="italic">
          This tool is not complete, but is already{' '}
          <span className="text-accent font-bold font-tenon-bold">
            useful for me
          </span>{' '}
          so I thought I&apos;d share as I build it out.
        </p>
      </section>
      <p>
        I am in <LocationAutocomplete onLocationSelect={handleLocationSelect} />
      </p>
      

      {/* <PlacePicker
        decks={decks}
        setDecks={setDecks}
        handleUseDefaultDeck={handleUseDefaultDeck}
      /> */}
    </div>
  );
}
