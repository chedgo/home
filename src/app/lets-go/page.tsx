'use client';
import React, { useState, useCallback, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { LocationCard } from '../components/LocationCard';
import useLocalStorage from '../../hooks/useLocalStorage';
import chicagoNeighborhoods from '../chicago_neighborhoods.json';

type Location = {
  name: string;
  description: string;
  wikipedia_link: string | null;
  latitude: number;
  longitude: number;
  isHidden?: boolean;
  snoozedUntil?: number;
};

type Deck = {
  name: string;
  locations: Location[];
  address: string;
  coords: { lat: number; lon: number };
};

export default function LetsGo() {
  const [decks, setDecks] = useLocalStorage<Deck[]>('userDecks', []);
  const [currentDeckIndex, setCurrentDeckIndex] = useState(0);
  const [showCards, setShowCards] = useState(false);
  const [randomLocation, setRandomLocation] = useState<Location | null>(null);
  const [maxDistance, setMaxDistance] = useState(10);
  const [showHiddenCards, setShowHiddenCards] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const currentDeck = decks[currentDeckIndex];

  const filteredLocations = useMemo(() => {
    if (!currentDeck) return [];
    return currentDeck.locations.filter((location: Location) => {
      const distance = calculateDistance(
        currentDeck.coords.lat,
        currentDeck.coords.lon,
        location.latitude,
        location.longitude
      );
      const distanceIsInRange = distance <= maxDistance;
      const isHidden = location.isHidden;
      const isSnoozed = location.snoozedUntil && location.snoozedUntil > Date.now();
      return distanceIsInRange && !isHidden && !isSnoozed;
    });
  }, [currentDeck, maxDistance]);

  const hiddenLocations = useMemo(() => {
    if (!currentDeck) return [];
    return currentDeck.locations.filter(
      (location: Location) =>
        location.isHidden ||
        (location.snoozedUntil && location.snoozedUntil > Date.now())
    );
  }, [currentDeck]);

  const handleHideLocation = useCallback(
    (name: string) => {
      const updatedDecks = decks.map((deck, index) => {
        if (index === currentDeckIndex) {
          return {
            ...deck,
            locations: deck.locations.map(loc => 
              loc.name === name ? { ...loc, isHidden: !loc.isHidden } : loc
            )
          };
        }
        return deck;
      });
      // Update the decks in localStorage
      localStorage.setItem('userDecks', JSON.stringify(updatedDecks));
    },
    [decks, currentDeckIndex]
  );

  const handleSnoozeLocation = useCallback(
    (name: string, duration: string) => {
      const durationInMs = parseDuration(duration);
      const snoozedUntil = durationInMs > 0 ? Date.now() + durationInMs : undefined;
      
      const updatedDecks = decks.map((deck, index) => {
        if (index === currentDeckIndex) {
          return {
            ...deck,
            locations: deck.locations.map(loc => 
              loc.name === name ? { ...loc, snoozedUntil } : loc
            )
          };
        }
        return deck;
      });
      // Update the decks in localStorage
      localStorage.setItem('userDecks', JSON.stringify(updatedDecks));
    },
    [decks, currentDeckIndex]
  );

  const generateRandomLocation = useCallback(() => {
    if (filteredLocations.length > 0) {
      const randomIndex = Math.floor(Math.random() * filteredLocations.length);
      setRandomLocation(filteredLocations[randomIndex]);
    } else {
      alert("No locations match your current filters. Try increasing the max distance or showing hidden locations.");
    }
  }, [filteredLocations]);

  const handleSliderChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setMaxDistance(Number(event.target.value));
  };

  const router = useRouter();

  const handleBuildDeck = () => {
    router.push('/build-deck');
  };

  const handleUseDefaultDeck = useCallback(() => {
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
    setCurrentDeckIndex(0);
  }, [setDecks]);

  // Helper functions
  function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
    const R = 6371;
    const dLat = deg2rad(lat2 - lat1);
    const dLon = deg2rad(lon2 - lon1);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const d = R * c;
    return d * 0.621371;
  }

  function deg2rad(deg: number): number {
    return deg * (Math.PI / 180);
  }

  function parseDuration(duration: string): number {
    const units = {
      'day': 24 * 60 * 60 * 1000,
      'week': 7 * 24 * 60 * 60 * 1000,
      'month': 30 * 24 * 60 * 60 * 1000,
      'year': 365 * 24 * 60 * 60 * 1000
    };

    const match = duration.match(/^(\d+)\s*([a-z]+)$/i);
    if (match) {
      const amount = parseInt(match[1]);
      const unit = match[2].toLowerCase() as keyof typeof units;
      if (unit in units) {
        return amount * units[unit];
      }
    }
    return 0;
  }

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
      
      {decks.length > 0 ? (
        <>
          <div className="mb-4">
            <label htmlFor="deck-select" className="block text-sm font-medium text-gray-700 mb-2">
              Select a Deck:
            </label>
            <select
              id="deck-select"
              value={currentDeckIndex}
              onChange={(e) => setCurrentDeckIndex(Number(e.target.value))}
              className="w-full p-2 border rounded"
            >
              {decks.map((deck, index) => (
                <option key={index} value={index}>{deck.name}</option>
              ))}
            </select>
          </div>
          
          <div className="flex justify-between mb-4 w-full">
            <button
              className="rounded-lg p-4 text-primary font-semibold"
              onClick={() => setShowCards(!showCards)}
            >
              {showCards ? 'Hide All' : 'Show All'}
            </button>
            <button
              className="rounded-lg p-4 bg-primary text-white"
              onClick={generateRandomLocation}
            >
              Generate Random Location
            </button>
            <button
              className="rounded-lg p-4 bg-secondary text-white"
              onClick={handleBuildDeck}
            >
              Build Deck
            </button>
          </div>
          
          <div className="mt-4">
            <label
              htmlFor="distance-slider"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Max Distance: {maxDistance} miles
            </label>
            <input
              id="distance-slider"
              type="range"
              min="0"
              max="35"
              value={maxDistance}
              onChange={handleSliderChange}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
            />
          </div>

          {randomLocation && (
            <div className="mt-4">
              <LocationCard
                key={randomLocation.name}
                location={randomLocation}
                onHide={handleHideLocation}
                onSnooze={handleSnoozeLocation}
                isHidden={false}
                showMapByDefault={true}
                originAddress={currentDeck.address}
                snoozedUntil={randomLocation.snoozedUntil}
              />
            </div>
          )}

          {showCards && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
              {filteredLocations.map((location, index) => (
                <LocationCard
                  key={index}
                  location={location}
                  onHide={handleHideLocation}
                  onSnooze={handleSnoozeLocation}
                  isHidden={location.isHidden || false}
                  originAddress={currentDeck.address}
                  snoozedUntil={location.snoozedUntil}
                />
              ))}
            </div>
          )}

          <div className="mt-8">
            <button
              className="rounded-lg p-4 text-primary font-semibold"
              onClick={() => setShowHiddenCards(!showHiddenCards)}
            >
              {showHiddenCards ? 'Hide' : 'Show'} Hidden and Snoozed Locations
              {` (${hiddenLocations.length})`}
            </button>

            {showHiddenCards && hiddenLocations.length > 0 && (
              <div className="mt-4">
                <h2 className="text-xl font-bold mb-4">
                  Hidden and Snoozed Locations
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {hiddenLocations.map((location, index) => (
                    <LocationCard
                      key={index}
                      location={location}
                      onHide={handleHideLocation}
                      onSnooze={handleSnoozeLocation}
                      isHidden={location.isHidden || false}
                      originAddress={currentDeck.address}
                      snoozedUntil={location.snoozedUntil}
                    />
                  ))}
                </div>
              </div>
            )}
          </div>
        </>
      ) : (
        <div className="text-center mt-8">
          <p className="mb-4">No decks available. Please create a deck or use the default deck.</p>
          <div className="flex justify-center space-x-4">
            <button
              className="rounded-lg p-4 bg-primary text-white"
              onClick={handleBuildDeck}
            >
              Go to Deck Builder
            </button>
            <button
              className="rounded-lg p-4 bg-secondary text-white"
              onClick={handleUseDefaultDeck}
            >
              Use Default Deck
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
