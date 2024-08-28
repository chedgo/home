'use client';
import { useState, useCallback, useEffect, useMemo, useRef } from 'react';
import locations from '../chicago_neighborhoods.json';
import useLocalStorage from '../../hooks/useLocalStorage';

type Location = {
  name: string;
  description: string;
  wikipedia_link?: string | null;
  google_maps_link?: string;
  distance_from_evanston: number;
  snoozedUntil?: number;
};

type GoogleMapsProps = {
  origin: string;
  destination: string;
  apiKey: string;
};

function GoogleMapsDirections({ origin, destination, apiKey }: GoogleMapsProps) {
  const encodedOrigin = encodeURIComponent(origin);
  const encodedDestination = encodeURIComponent(destination);
  const src = `https://www.google.com/maps/embed/v1/directions?key=${apiKey}&origin=${encodedOrigin}&destination=${encodedDestination}`;

  return (
    <iframe
      width="100%"
      height="300"
      style={{ border: 0 }}
      loading="lazy"
      allowFullScreen
      src={src}
    ></iframe>
  );
}

function LocationCard({
  location,
  onHide,
  onSnooze,
  isHidden,
  showMapByDefault = false,
  originAddress,
}: {
  location: Location;
  onHide: (name: string) => void;
  onSnooze: (name: string) => void;
  isHidden: boolean;
  showMapByDefault?: boolean;
  originAddress: string;
}) {
  const [mounted, setMounted] = useState(false);
  const [localIsHidden, setLocalIsHidden] = useState(isHidden);
  const [showMap, setShowMap] = useState(showMapByDefault);

  useEffect(() => {
    setMounted(true);
    setLocalIsHidden(isHidden);
  }, [isHidden]);

  const handleHideChange = () => {
    setLocalIsHidden(!localIsHidden);
    onHide(location.name);
  };

  const isSnoozed = useMemo(() => {
    return (
      mounted &&
      location.snoozedUntil !== undefined &&
      location.snoozedUntil > Date.now()
    );
  }, [mounted, location.snoozedUntil]);

  const snoozedUntilDate = useMemo(() => {
    if (isSnoozed && location.snoozedUntil) {
      return new Date(location.snoozedUntil).toLocaleDateString();
    }
    return null;
  }, [isSnoozed, location.snoozedUntil]);

  return (
    <div className="border-2 border-primary p-4 m-2 rounded-lg transition-shadow duration-300">
      <div className="flex justify-between items-start mb-2">
        <h2 className="text-xl font-bold">{location.name}</h2>
        {mounted && (
          <>
            <label className="flex items-center" title="Never show again">
              <input
                type="checkbox"
                className="form-checkbox h-5 w-5 text-primary"
                onChange={handleHideChange}
                checked={localIsHidden}
              />
              <span className="ml-2 text-sm">I hate it</span>
            </label>
            <label className="flex items-center" title="Snooze for 3 months">
              <input
                type="checkbox"
                className="form-checkbox h-5 w-5 text-secondary"
                onChange={() => onSnooze(location.name)}
                checked={isSnoozed}
              />
              <span className="ml-2 text-sm">snooze</span>
            </label>
          </>
        )}
      </div>
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
      {isSnoozed && snoozedUntilDate && (
        <p className="mt-2 text-sm text-gray-500">
          Snoozed until: {snoozedUntilDate}
        </p>
      )}
      
      <button
        onClick={() => setShowMap(!showMap)}
        className="mt-2 text-primary underline"
      >
        {showMap ? 'Hide Map' : 'Show Map'}
      </button>
      
      {showMap && (
        <div className="mt-4">
          <GoogleMapsDirections
            origin={originAddress || ''}
            destination={`${location.name}, Chicago`}
            apiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || ''}
          />
        </div>
      )}
    </div>
  );
}

export default function Playground() {
  const [showCards, setShowCards] = useState(false);
  const [randomLocation, setRandomLocation] = useState<Location | null>(null);
  const [maxDistance, setMaxDistance] = useState(10); // Default max distance
  const [showHiddenCards, setShowHiddenCards] = useState(false);
  const [originAddress, setOriginAddress] = useState('Evanston, IL');

  const generateRandomLocation = () => {
    const randomIndex = Math.floor(Math.random() * filteredLocations.length);
    setRandomLocation(filteredLocations[randomIndex]);
  };

  const handleSliderChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setMaxDistance(Number(event.target.value));
  };
  const [locationPreferences, setLocationPreferences] = useLocalStorage(
    'locationPreferences',
    { hidden: [], snoozed: {} }
  );
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const getLocationWithSnoozedUntil = useCallback(
    (location: Location) => {
      const snoozedUntil = locationPreferences.snoozed[location.name];
      return {
        ...location,
        snoozedUntil: snoozedUntil ? Number(snoozedUntil) : undefined,
      };
    },
    [locationPreferences.snoozed]
  );

  const filteredLocations = useMemo(() => {
    if (!isClient) return [];
    return locations
      .filter((location: Location) => {
        const distanceIsInRange =
          location.distance_from_evanston <= maxDistance;
        const isHidden = locationPreferences.hidden.includes(location.name);
        return distanceIsInRange && !isHidden;
      })
      .map(getLocationWithSnoozedUntil);
  }, [maxDistance, locationPreferences, isClient, getLocationWithSnoozedUntil]);

  const isLocationSnoozed = useCallback(
    (location: Location) => {
      const snoozedUntil = locationPreferences.snoozed[location.name];
      return snoozedUntil && Number(snoozedUntil) > Date.now();
    },
    [locationPreferences.snoozed]
  );

  const hiddenLocations = useMemo(() => {
    if (!isClient) return [];
    return locations
      .filter(
        (location: Location) =>
          locationPreferences.hidden.includes(location.name) ||
          isLocationSnoozed(location)
      )
      .map(getLocationWithSnoozedUntil);
  }, [
    locationPreferences.hidden,
    locationPreferences.snoozed,
    isClient,
    getLocationWithSnoozedUntil,
    isLocationSnoozed,
  ]);

  const handleHideLocation = useCallback(
    (name: string) => {
      setLocationPreferences(
        (prev: { hidden: string[]; snoozed: Record<string, number> }) => {
          const isCurrentlyHidden = prev.hidden.includes(name);
          const updatedHidden = isCurrentlyHidden
            ? prev.hidden.filter((loc) => loc !== name)
            : [...prev.hidden, name];
          return {
            ...prev,
            hidden: updatedHidden,
          };
        }
      );
    },
    [setLocationPreferences]
  );

  const handleSnoozeLocation = useCallback(
    (name: string) => {
      setLocationPreferences(
        (prev: { hidden: string[]; snoozed: Record<string, number> }) => {
          const now = Date.now();
          const threeMonthsFromNow = now + 90 * 24 * 60 * 60 * 1000;
          return {
            ...prev,
            snoozed: {
              ...prev.snoozed,
              [name]:
                prev.snoozed[name] && prev.snoozed[name] > now
                  ? undefined
                  : threeMonthsFromNow,
            },
          };
        }
      );
    },
    [setLocationPreferences]
  );

  useEffect(() => {
    // Remove expired snoozes
    const now = Date.now();
    const updatedSnoozed = Object.fromEntries(
      Object.entries(locationPreferences.snoozed).filter(
        ([_, value]) => typeof value === 'number' && value > now
      )
    );
    if (
      JSON.stringify(updatedSnoozed) !==
      JSON.stringify(locationPreferences.snoozed)
    ) {
      setLocationPreferences(
        (prev: { hidden: string[]; snoozed: Record<string, number> }) => ({
          ...prev,
          snoozed: updatedSnoozed,
        })
      );
    }
  }, [locationPreferences.snoozed, setLocationPreferences]);

  const hiddenLocationsRef = useRef(hiddenLocations);
  useEffect(() => {
    hiddenLocationsRef.current = hiddenLocations;
  }, [hiddenLocations]);

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
      
      <div className="mt-4">
        <label htmlFor="origin-address" className="block text-sm font-medium text-gray-700 mb-2">
          Starting Address:
        </label>
        <input
          id="origin-address"
          type="text"
          value={originAddress}
          onChange={(e) => setOriginAddress(e.target.value)}
          className="w-full p-2 border rounded"
        />
      </div>

      {showCards && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
          {filteredLocations.map((location, index) => (
            <LocationCard
              key={index}
              location={location}
              onHide={handleHideLocation}
              onSnooze={handleSnoozeLocation}
              isHidden={locationPreferences.hidden.includes(location.name)}
              originAddress={originAddress}
            />
          ))}
        </div>
      )}

      {randomLocation && Object.keys(randomLocation).length > 0 && (
        <div className="mt-4">
          <LocationCard
            key={randomLocation.name}
            location={getLocationWithSnoozedUntil(randomLocation)}
            onHide={handleHideLocation}
            onSnooze={handleSnoozeLocation}
            isHidden={false}
            showMapByDefault={true}
            originAddress={originAddress}
          />
        </div>
      )}

      <div className="mt-8">
        <button
          className="rounded-lg p-4 text-primary font-semibold"
          onClick={() => setShowHiddenCards(!showHiddenCards)}
        >
          {showHiddenCards ? 'Hide' : 'Show'} Hidden and Snoozed Locations
          {isClient && ` (${hiddenLocations.length})`}
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
                  isHidden={locationPreferences.hidden.includes(location.name)}
                  originAddress={originAddress}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
