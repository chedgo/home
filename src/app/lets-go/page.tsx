'use client';
import { useState } from 'react';
import locations from '../chicago_neighborhoods.json';

function LocationCard({ location }: { location: any }) {
  return (
    <div className="border-2 border-primary p-4 m-2 rounded-lg transition-shadow duration-300">
      <h2 className="text-xl font-bold mb-2">{location.name}</h2>
      <p className="mb-2">{location.description}</p>
      {location.wikipedia_link && (
        <a
          href={location.wikipedia_link}
          className="text-primary underline"
          target="_blank"
          rel="noopener noreferrer"
        >
          Wikipedia
        </a>
      )}
      <br />
      <a
        href={`https://www.google.com/maps/search/?api=1&query=${location.name}+near+Chicago`}
        target="_blank"
        rel="noopener noreferrer"
        className="text-primary underline"
        >
        Google Maps
      </a>
      <p className="mt-2">Distance from Evanston: {location.distance_from_evanston || 0} miles</p>
    </div>
  );
}

export default function Playground() {
  const [showCards, setShowCards] = useState(false);
  const [randomLocation, setRandomLocation] = useState({});
  const [maxDistance, setMaxDistance] = useState(10); // Default max distance

  const generateRandomLocation = () => {
    const randomIndex = Math.floor(Math.random() * filteredLocations.length);
    setRandomLocation(filteredLocations[randomIndex]);
  };

  const handleSliderChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setMaxDistance(Number(event.target.value));
  };

  const filteredLocations = locations.filter((location) => {
    const distance = parseInt(location.distance_from_evanston || "0");
    return distance <= maxDistance;
  });

  return (
    <div className="p-6 w-full">
      <div className="mb-6 w-full">
        <h1 className="text-2xl font-bold mb-2 w-full flex justify-center text-primary">Let's Go</h1>
        <p className="text-primary">
          This tool was made to help me and my wife decide where to go take photos when we can't decide. 
          The vision is that the list of locations is generated taking into account user preferences and provides some customization options. 
          It allows the user to react to cards as they go, and stores changes. This tool is not complete, but is already useful for me so I thought I'd share.
        </p>
      </div>
      <div className="flex justify-between mb-4 w-full">
        <button
          className="rounded-lg p-4 text-primary font-semibold"
          onClick={() => setShowCards(!showCards)}
        >
          {showCards ? 'Hide All' : 'Show All'}
        </button>
        <div className="flex justify-center w-full">
          <button
            className="rounded-lg p-4 bg-primary text-white"
            onClick={generateRandomLocation}
          >
            Where should I go?
          </button>
        </div>
      </div>
      <div className="mt-4">
        <label
          htmlFor="distance-slider"
          className="block text-sm font-medium text-gray-700 mb-2"
        >
          Max Distance from Evanston: {maxDistance} miles
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
      {showCards && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
          {filteredLocations.map((location, index) => (
            <LocationCard key={index} location={location} />
          ))}
        </div>
      )}
      {randomLocation && (
        <div className="mt-4">
          <LocationCard location={randomLocation} />
        </div>
      )}
    </div>
  );
}