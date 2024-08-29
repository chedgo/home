'use client';
import React, { useState, useEffect, useCallback } from 'react';
import useLocalStorage from '../../hooks/useLocalStorage';
import { LocationCard } from '../lets-go/page'; // Assuming LocationCard is exported from here

type Location = {
  name: string;
  description: string;
  wikipedia_link: string | null;
  latitude: number;
  longitude: number;
};

export default function BuildDeck() {
  const [deck, setDeck] = useLocalStorage('userDeck', []);
  const [address, setAddress] = useState('');
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(true);
  const [originCoords, setOriginCoords] = useState({ lat: 0, lon: 0 });
  const [isLocationSet, setIsLocationSet] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [locations, setLocations] = useState<Location[]>([]);

  useEffect(() => {
    const fetchSuggestions = async () => {
      if (address.length > 2) {
        try {
          const response = await fetch(
            `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(address)}`
          );
          if (!response.ok) {
            throw new Error('Network response was not ok');
          }
          const data = await response.json();
          setSuggestions(data);
        } catch (error) {
          console.error('Error fetching suggestions:', error);
        }
      } else {
        setSuggestions([]);
      }
    };

    const timeoutId = setTimeout(fetchSuggestions, 300);
    return () => clearTimeout(timeoutId);
  }, [address]);

  const handleSuggestionSelect = (suggestion: any) => {
    setAddress(suggestion.display_name);
    setOriginCoords({
      lat: parseFloat(suggestion.lat),
      lon: parseFloat(suggestion.lon),
    });
    setSuggestions([]);
    setShowSuggestions(false);
    setIsLocationSet(true);
  };

  const handleLocateMe = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const newCoords = {
            lat: position.coords.latitude,
            lon: position.coords.longitude,
          };
          setOriginCoords(newCoords);
          const coordsString = `${newCoords.lat}, ${newCoords.lon}`;
          setAddress(coordsString);
          setIsLocationSet(true);

          // Attempt to get a readable address
          const readableAddress = await reverseGeocode(newCoords.lat, newCoords.lon);
          if (readableAddress) {
            setAddress(readableAddress);
          }
        },
        (error) => {
          console.error("Error getting user location:", error);
          alert("Unable to retrieve your location. Please enter it manually.");
        }
      );
    } else {
      alert("Geolocation is not supported by your browser. Please enter your location manually.");
    }
  };

  const reverseGeocode = async (lat: number, lon: number) => {
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}`
      );
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data = await response.json();
      return data.display_name;
    } catch (error) {
      console.error('Error reverse geocoding:', error);
      return null;
    }
  };

  const fetchLocations = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`/api/locations?latitude=${originCoords.lat}&longitude=${originCoords.lon}`);
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
  }, [originCoords]);

  const handleGenerateIdeas = useCallback(() => {
    fetchLocations();
  }, [fetchLocations]);

  const addToDeck = (location: Location) => {
    setDeck(prevDeck => [...prevDeck, location]);
    setLocations(prevLocations => prevLocations.filter(loc => loc.name !== location.name));
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Build Your Deck</h1>
      <div className="mb-4">
        <label htmlFor="origin-address" className="block text-sm font-medium text-gray-700 mb-2">
          Starting Address:
        </label>
        <div className="relative">
          <input
            id="origin-address"
            type="text"
            value={address}
            onChange={(e) => {
              setAddress(e.target.value);
              setShowSuggestions(true);
            }}
            className="w-full p-2 border rounded"
          />
          {showSuggestions && suggestions.length > 0 && (
            <ul className="absolute z-10 w-full bg-white border rounded mt-1">
              {suggestions.map((suggestion, index) => (
                <li
                  key={index}
                  onClick={() => handleSuggestionSelect(suggestion)}
                  className="p-2 hover:bg-gray-100 cursor-pointer"
                >
                  {suggestion.display_name}
                </li>
              ))}
            </ul>
          )}
        </div>
        <button
          onClick={handleLocateMe}
          className="mt-2 p-2 bg-primary text-white rounded"
        >
          Locate Me
        </button>
      </div>
      {isLocationSet && (
        <button
          className="mb-4 p-2 bg-primary text-white rounded"
          onClick={handleGenerateIdeas}
          disabled={isLoading}
        >
          {isLoading ? 'Generating Ideas...' : 'Generate Ideas'}
        </button>
      )}
      {isLoading ? (
        <div className="mt-4 text-center">Loading locations...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
          {locations.map((location, index) => (
            <div key={index} className="border p-4 rounded">
              <LocationCard
                location={location}
                onHide={() => {}} // Placeholder function
                onSnooze={() => {}} // Placeholder function
                isHidden={false}
                originAddress={address}
                snoozedUntil={undefined}
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
      <div className="mt-8">
        <h2 className="text-xl font-semibold mb-2">Your Deck</h2>
        {deck.map((location, index) => (
          <div key={index} className="mb-2 p-2 border rounded">
            <h3>{location.name}</h3>
            <p>{location.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
}