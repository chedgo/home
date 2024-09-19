'use client';
import React, { useState, useEffect, useCallback } from 'react';
import useLocalStorage from '../../hooks/useLocalStorage';
import { LocationCard } from '../components/LocationCard';
import { Tab, Dialog, Transition } from '@headlessui/react'
import { Fragment } from 'react'
import chicagoNeighborhoods from '../chicago_neighborhoods.json';
import Link from 'next/link';

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

export default function BuildDeck() {
  const [decks, setDecks] = useLocalStorage<Deck[]>('userDecks', []);
  const [currentDeckIndex, setCurrentDeckIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [locations, setLocations] = useState<Location[]>([]);
  const [isNewDeckModalOpen, setIsNewDeckModalOpen] = useState(false);
  const [newDeckName, setNewDeckName] = useState('');
  const [newDeckAddress, setNewDeckAddress] = useState('');
  const [newDeckCoords, setNewDeckCoords] = useState({ lat: 0, lon: 0 });
  const [suggestions, setSuggestions] = useState<any[]>([]);

  const fetchLocations = useCallback(async () => {
    if (decks.length === 0 || currentDeckIndex >= decks.length) {
      console.log("No decks available or invalid deck index");
      return;
    }

    const currentDeck = decks[currentDeckIndex];
    if (!currentDeck || !currentDeck.coords) {
      console.error("Current deck or its coordinates are undefined");
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch(`/api/locations?latitude=${currentDeck.coords.lat}&longitude=${currentDeck.coords.lon}`);
      if (!response.ok) {
        throw new Error('Failed to fetch locations');
      }
      const data = await response.json();
      setLocations(data.locations);
    } catch (error) {
      console.error('Error fetching locations:', error);
    } finally {
      setIsLoading(false);
    }
  }, [decks, currentDeckIndex]);

  const handleGenerateIdeas = useCallback(() => {
    if (decks.length > 0) {
      fetchLocations();
    } else {
      console.log("No decks available. Please create a deck first.");
      // Optionally, you can show a message to the user here
    }
  }, [fetchLocations, decks]);

  const handleNewDeckSuggestionSelect = (suggestion: any) => {
    setNewDeckAddress(suggestion.display_name);
    setNewDeckCoords({
      lat: parseFloat(suggestion.lat),
      lon: parseFloat(suggestion.lon),
    });
    setSuggestions([]);
  };

  const addDeck = () => {
    if (newDeckName && newDeckAddress) {
      setDecks(prevDecks => {
        const newDecks = [
          ...prevDecks, 
          { 
            name: newDeckName, 
            locations: [],
            address: newDeckAddress,
            coords: newDeckCoords
          }
        ];
        setCurrentDeckIndex(newDecks.length - 1);
        return newDecks;
      });
      setIsNewDeckModalOpen(false);
      setNewDeckName('');
      setNewDeckAddress('');
      setNewDeckCoords({ lat: 0, lon: 0 });
    }
  };

  const addToDeck = (location: Location) => {
    setDecks(prevDecks => {
      const updatedDecks = [...prevDecks];
      updatedDecks[currentDeckIndex].locations.push({ ...location, isHidden: false, snoozedUntil: undefined });
      return updatedDecks;
    });
    setLocations(prevLocations => prevLocations.filter(loc => loc.name !== location.name));
  };

  const toggleHidden = (location: Location) => {
    setDecks(prevDecks => {
      const updatedDecks = [...prevDecks];
      const currentDeck = updatedDecks[currentDeckIndex];
      const existingLocation = currentDeck.locations.find(loc => loc.name === location.name);
      if (existingLocation) {
        currentDeck.locations = currentDeck.locations.map(loc => 
          loc.name === location.name ? { ...loc, isHidden: !loc.isHidden } : loc
        );
      } else {
        currentDeck.locations.push({ ...location, isHidden: true });
      }
      return updatedDecks;
    });

    setLocations(prevLocations => prevLocations.filter(loc => loc.name !== location.name));
  };

  const snoozeLocation = (locationName: string, snoozeDuration: string) => {
    const durationInMs = parseDuration(snoozeDuration);
    const snoozedUntil = durationInMs > 0 ? Date.now() + durationInMs : undefined;
    
    setDecks(prevDecks => {
      const updatedDecks = [...prevDecks];
      updatedDecks[currentDeckIndex].locations = updatedDecks[currentDeckIndex].locations.map(loc => 
        loc.name === locationName ? { ...loc, snoozedUntil } : loc
      );
      return updatedDecks;
    });
    
    setLocations(prevLocations => prevLocations.map(loc => 
      loc.name === locationName ? { ...loc, snoozedUntil } : loc
    ));
  };

  const parseDuration = (duration: string): number => {
    const [value, unit] = duration.split(' ');
    const numValue = parseInt(value, 10);
    switch (unit) {
      case 'minutes':
        return numValue * 60 * 1000;
      case 'hours':
        return numValue * 60 * 60 * 1000;
      case 'days':
        return numValue * 24 * 60 * 60 * 1000;
      default:
        return 0;
    }
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

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Build Your Deck</h1>
      <Link href="/lets-go" className="inline-block mb-4 text-blue-600 hover:text-blue-800">
        ← Back to Picker
      </Link>
      {decks.length === 0 ? (
        <div className="mt-8 text-center">
          <p className="mb-4">No decks available. Please create a deck or use the default deck.</p>
          <div className="flex justify-center space-x-4">
            <button
              onClick={() => setIsNewDeckModalOpen(true)}
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700"
            >
              Create New Deck
            </button>
            <button
              onClick={handleUseDefaultDeck}
              className="px-4 py-2 text-sm font-medium text-white bg-green-600 rounded-lg hover:bg-green-700"
            >
              Use Default Deck
            </button>
          </div>
        </div>
      ) : (
        <div className="mt-8">
          <h2 className="text-xl font-semibold mb-2">Your Decks</h2>
          <Tab.Group selectedIndex={currentDeckIndex} onChange={setCurrentDeckIndex}>
            <Tab.List className="flex space-x-1 rounded-xl bg-blue-900/20 p-1">
              {decks.map((deck, index) => (
                <Tab
                  key={index}
                  className={({ selected }) =>
                    `w-full rounded-lg py-2.5 text-sm font-medium leading-5 text-blue-700
                    ${selected ? 'bg-white shadow' : 'text-blue-100 hover:bg-white/[0.12] hover:text-white'}`
                  }
                >
                  {deck.name}
                </Tab>
              ))}
              <button
                onClick={() => setIsNewDeckModalOpen(true)}
                className="px-3 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700"
              >
                + New Deck
              </button>
            </Tab.List>
            <Tab.Panels className="mt-2">
              {decks.map((deck, idx) => (
                <Tab.Panel key={idx}>
                  <div className="mb-4">
                    <p>Location: {deck.address}</p>
                    <button
                      className="mt-2 p-2 bg-primary text-white rounded"
                      onClick={handleGenerateIdeas}
                      disabled={isLoading || decks.length === 0}
                    >
                      {isLoading ? 'Generating Ideas...' : 'Generate Ideas'}
                    </button>
                  </div>
                  {deck.locations.filter(location => !location.isHidden).map((location, index) => (
                    <div key={index} className="mb-2 p-2 border rounded">
                      <LocationCard
                        location={location}
                        onHide={() => toggleHidden(location)}
                        onSnooze={(name, duration) => snoozeLocation(name, duration)}
                        isHidden={false}
                        originAddress={deck.address}
                        snoozedUntil={location.snoozedUntil}
                      />
                    </div>
                  ))}
                </Tab.Panel>
              ))}
            </Tab.Panels>
          </Tab.Group>
        </div>
      )}

      {isLoading ? (
        <div className="mt-4 text-center">Loading locations...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
          {locations.map((location, index) => (
            <div key={index} className="border p-4 rounded">
              <LocationCard
                location={location}
                onHide={() => toggleHidden(location)}
                onSnooze={(name, duration) => snoozeLocation(name, duration)}
                isHidden={false}
                originAddress={decks[currentDeckIndex]?.address || ''}
                snoozedUntil={location.snoozedUntil}
              />
              <button 
                onClick={() => addToDeck(location)} 
                className="mt-2 p-2 bg-secondary text-white rounded w-full"
              >
                Add to Deck
              </button>
            </div>
          ))}
        </div>
      )}

      <Transition appear show={isNewDeckModalOpen} as={Fragment}>
        <Dialog as="div" className="relative z-10" onClose={() => setIsNewDeckModalOpen(false)}>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black bg-opacity-25" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4 text-center">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Dialog.Panel className="w-full max-w-md transform overflow-visible rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                  <Dialog.Title
                    as="h3"
                    className="text-lg font-medium leading-6 text-gray-900"
                  >
                    Create New Deck
                  </Dialog.Title>
                  <div className="mt-2">
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
                        onChange={(e) => {
                          setNewDeckAddress(e.target.value);
                          // Fetch suggestions for the new deck address
                          if (e.target.value.length > 2) {
                            fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(e.target.value)}`)
                              .then(response => response.json())
                              .then(data => setSuggestions(data))
                              .catch(error => console.error('Error fetching suggestions:', error));
                          } else {
                            setSuggestions([]);
                          }
                        }}
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
                              {suggestion.display_name}
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  </div>

                  <div className="mt-4">
                    <button
                      type="button"
                      className="inline-flex justify-center rounded-md border border-transparent bg-blue-100 px-4 py-2 text-sm font-medium text-blue-900 hover:bg-blue-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
                      onClick={addDeck}
                    >
                      Create Deck
                    </button>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </div>
  );
}