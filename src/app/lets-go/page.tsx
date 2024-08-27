'use client';
import { useState } from 'react';
import locations from '../chicago_neighborhoods.json';

function LocationCard({ location }: { location: any }) {
  return (
    <div className="border p-4 m-2 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300">
      <h2 className="text-xl font-bold mb-2">{location.name}</h2>
      <p className="mb-2">{location.description}</p>
      {location.wikipedia_link && (
        <a
          href={location.wikipedia_link}
          className="text-blue-500 hover:text-blue-700 transition-colors duration-300"
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
        className="text-blue-500 hover:text-blue-700 transition-colors duration-300"
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
    <div className="p-6">
      <div className="flex justify-center mb-4">
        <button
          className="rounded-lg p-4 bg-blue-600 text-white hover:bg-blue-700 transition-colors duration-300"
          onClick={() => setShowCards(!showCards)}
        >
          {showCards ? 'Hide All' : 'Show All'}
        </button>
        <button
          className="rounded-lg p-4 bg-green-600 text-white hover:bg-green-700 transition-colors duration-300 ml-4"
          onClick={generateRandomLocation}
        >
          Generate Random
        </button>
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