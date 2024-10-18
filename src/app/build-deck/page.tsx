'use client';
import React, { useState, useCallback } from 'react';
import useLocalStorage from '../../hooks/useLocalStorage';
import { LocationCard } from '../../components/LocationCard';
import { Tab, TabGroup, TabList, TabPanel, TabPanels } from '@headlessui/react';
import chicagoNeighborhoods from '../chicago_neighborhoods.json';
import Link from 'next/link';
import { Deck, Location } from '../../types';
import { Modal } from '../../components/Modal';
import { CreateDeckForm } from '../../components/CreateDeckForm'; // New import
import { useFetchLocations } from '@/hooks/useFetchLocations';

export default function BuildDeck() {
  const [decks, setDecks] = useLocalStorage<Deck[]>('userDecks', []);
  const [currentDeckIndex, setCurrentDeckIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [locations, setLocations] = useState<Location[]>([]);
  const [isCreateDeckModalOpen, setIsCreateDeckModalOpen] = useState(false);
  // const [newDeckName, setNewDeckName] = useState('');
  // const [newDeckAddress, setNewDeckAddress] = useState('');
  // const [newDeckCoords, setNewDeckCoords] = useState({ lat: 0, lon: 0 });
  // const [suggestions, setSuggestions] = useState<any[]>([]);

  const { fetchLocations } = useFetchLocations();

  // const handleNewDeckSuggestionSelect = (suggestion: any) => {
  //   setNewDeckAddress(suggestion.display_name);
  //   setNewDeckCoords({
  //     lat: parseFloat(suggestion.lat),
  //     lon: parseFloat(suggestion.lon),
  //   });
  //   // setSuggestions([]);
  // };

  const handleCreateDeck = useCallback(
    (newDeck: Deck) => {
      setDecks((prevDecks) => [...prevDecks, newDeck]);
      setCurrentDeckIndex((prevDecks) => prevDecks + 1);
      setIsCreateDeckModalOpen(false);
    },
    [setDecks]
  );

  // const addDeck = () => {
  //   if (newDeckName && newDeckAddress) {
  //     setDecks((prevDecks) => {
  //       const newDecks = [
  //         ...prevDecks,
  //         {
  //           id: Date.now().toString(), // Add a unique id
  //           name: newDeckName,
  //           locations: [],
  //           address: newDeckAddress,
  //           coords: newDeckCoords,
  //         },
  //       ];
  //       setCurrentDeckIndex(newDecks.length - 1);
  //       return newDecks;
  //     });
  //     setNewDeckName('');
  //     setNewDeckAddress('');
  //     setNewDeckCoords({ lat: 0, lon: 0 });
  //   }
  // };

  const addToDeck = (location: Location) => {
    setDecks((prevDecks) => {
      const updatedDecks = [...prevDecks];
      updatedDecks[currentDeckIndex].locations.push({
        ...location,
        isHidden: false,
        snoozedUntil: undefined,
      });
      return updatedDecks;
    });
    setLocations((prevLocations) =>
      prevLocations.filter((loc) => loc.name !== location.name)
    );
  };

  const toggleHidden = (location: Location) => {
    setDecks((prevDecks) => {
      const updatedDecks = [...prevDecks];
      const currentDeck = updatedDecks[currentDeckIndex];
      const existingLocation = currentDeck.locations.find(
        (loc) => loc.name === location.name
      );
      if (existingLocation) {
        currentDeck.locations = currentDeck.locations.map((loc) =>
          loc.name === location.name ? { ...loc, isHidden: !loc.isHidden } : loc
        );
      } else {
        currentDeck.locations.push({ ...location, isHidden: true });
      }
      return updatedDecks;
    });

    setLocations((prevLocations) =>
      prevLocations.filter((loc) => loc.name !== location.name)
    );
  };

  const snoozeLocation = (locationName: string, snoozeDuration: string) => {
    const durationInMs = parseDuration(snoozeDuration);
    const snoozedUntil =
      durationInMs > 0 ? Date.now() + durationInMs : undefined;

    setDecks((prevDecks) => {
      const updatedDecks = [...prevDecks];
      updatedDecks[currentDeckIndex].locations = updatedDecks[
        currentDeckIndex
      ].locations.map((loc) =>
        loc.name === locationName ? { ...loc, snoozedUntil } : loc
      );
      return updatedDecks;
    });

    setLocations((prevLocations) =>
      prevLocations.map((loc) =>
        loc.name === locationName ? { ...loc, snoozedUntil } : loc
      )
    );
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
      name: 'Chicago Neighborhoods',
      id: 'chicago-neighborhoods',
      locations: chicagoNeighborhoods.map((location) => ({
        ...location,
        coords: {
          lat: location.latitude,
          lon: location.longitude,
        },
        isHidden: false,
        snoozedUntil: undefined,
        wikipedia_link: location.wikipedia_link || null,
      })),
      address: 'Chicago, IL',
      coords: { lat: 41.8781, lon: -87.6298 }, // Chicago's coordinates
    };
    setDecks([defaultDeck]);
    setCurrentDeckIndex(0);
  }, [setDecks]);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Build Your Deck</h1>
      <Link
        href="/lets-go"
        className="inline-block mb-4 text-blue-600 hover:text-blue-800"
      >
        ← Back to Picker
      </Link>
      {/* { (
        <div className="mt-8">
          <h2 className="text-xl font-semibold mb-2">Your Decks</h2>
          <TabGroup
            selectedIndex={currentDeckIndex}
            onChange={setCurrentDeckIndex}
          >
            <TabList className="flex space-x-1 rounded-xl bg-blue-900/20 p-1">
              {decks.map((deck, index) => (
                <Tab
                  key={index}
                  className={({ selected }) =>
                    `w-full rounded-lg py-2.5 text-sm font-medium leading-5 text-blue-700
                    ${
                      selected
                        ? 'bg-white shadow'
                        : 'text-blue-100 hover:bg-white/[0.12] hover:text-white'
                    }`
                  }
                >
                  {deck.name}
                </Tab>
              ))}
              <button
                onClick={() => setIsCreateDeckModalOpen(true)}
                className="px-3 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700"
              >
                + New Deck
              </button>
            </TabList>
            <TabPanels className="mt-2">
              {decks.map((deck, idx) => (
                <TabPanel key={idx}>
                  <div className="mb-4">
                    <p>Location: {deck.address}</p>
                    <button
                      className="mt-2 p-2 bg-primary text-white rounded"
                      onClick={() =>
                        fetchLocations(deck.coords, deck.activities)
                      }
                      disabled={isLoading || decks.length === 0}
                    >
                      {isLoading ? 'Generating Ideas...' : 'Generate Ideas'}
                    </button>
                  </div>
                  {deck.locations
                    .filter((location) => !location.isHidden)
                    .map((location, index) => (
                      <div key={index} className="mb-2 p-2 border rounded">
                        <LocationCard
                          location={location}
                          onHide={() => toggleHidden(location)}
                          onSnooze={(name, duration) =>
                            snoozeLocation(name, duration)
                          }
                          isHidden={false}
                          originAddress={deck.address}
                          snoozedUntil={location.snoozedUntil}
                        />
                      </div>
                    ))}
                </TabPanel>
              ))}
            </TabPanels>
          </TabGroup>
        </div>
      )} */}

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

      <Modal
        isOpen={isCreateDeckModalOpen}
        onClose={() => setIsCreateDeckModalOpen(false)}
        title="Create New Deck"
      >
        <CreateDeckForm onCreateDeck={handleCreateDeck} />
      </Modal>
    </div>
  );
}
