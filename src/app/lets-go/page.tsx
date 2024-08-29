'use client';
import { useState, useCallback, useEffect, useMemo, useRef } from 'react';
import useLocalStorage from '../../hooks/useLocalStorage';
import Image from 'next/image';

type Location = {
  name: string;
  description: string;
  wikipedia_link: string | null;
  latitude: number;
  longitude: number;
};

const mockFetchLocations = async (latitude: number, longitude: number): Promise<Location[]> => {
  await new Promise(resolve => setTimeout(resolve, 500));

  return [
    {
      name: "Mock Location 1",
      description: "This is a mock location for testing purposes.",
      wikipedia_link: "https://en.wikipedia.org/wiki/Mock",
      latitude: latitude + 0.1,
      longitude: longitude + 0.1,
    },
    {
      name: "Mock Location 2",
      description: "Another mock location for testing.",
      wikipedia_link: null,
      latitude: latitude - 0.1,
      longitude: longitude - 0.1,
    },
  ];
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
  snoozedUntil,
}: {
  location: Location;
  onHide: (name: string) => void;
  onSnooze: (name: string) => void;
  isHidden: boolean;
  showMapByDefault?: boolean;
  originAddress: string;
  snoozedUntil: number | undefined;
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
    return mounted && snoozedUntil !== undefined && snoozedUntil > Date.now();
  }, [mounted, snoozedUntil]);

  const snoozedUntilDate = useMemo(() => {
    if (isSnoozed && snoozedUntil) {
      return new Date(snoozedUntil).toLocaleDateString();
    }
    return null;
  }, [isSnoozed, snoozedUntil]);

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
      <div className="flex items-center mt-2 space-x-2">
        {location.wikipedia_link && (
          <a
            href={location.wikipedia_link}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block"
          >
            <div className="w-5 h-5 relative">
              <Image
                src="/wikipedia.svg"
                alt="Wikipedia"
                width={20}
                height={20}
                priority
                className="object-contain hover:opacity-80 transition-opacity"
              />
            </div>
          </a>
        )}
        <button
          onClick={() => setShowMap(!showMap)}
          className="inline-block"
          title={showMap ? 'Hide Map' : 'Show Map'}
        >
          <div className="w-5 h-4 relative">
            <Image
              src="/gmaps.svg"
              alt="Google Maps"
              fill
              className={`object-contain hover:opacity-80 transition-opacity ${showMap ? 'opacity-50' : ''}`}
            />
          </div>
        </button>
      </div>
      
      {isSnoozed && snoozedUntilDate && (
        <p className="mt-2 text-sm text-gray-500">
          Snoozed until: {snoozedUntilDate}
        </p>
      )}
      
      {showMap && (
        <div className="mt-4">
          <GoogleMapsDirections
            origin={originAddress}
            destination={`${location.latitude},${location.longitude}`}
            apiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || ''}
          />
        </div>
      )}
    </div>
  );
}

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

// Add a new function to fetch real locations from the backend
const fetchRealLocations = async (latitude: number, longitude: number): Promise<Location[]> => {
  const response = await fetch(`/api/locations?latitude=${latitude}&longitude=${longitude}`);
  if (!response.ok) {
    throw new Error('Failed to fetch locations');
  }
  const data = await response.json();
  return data.locations;
};


const USE_MOCK_DATA = false; // Set this to false when you want to use real data

export default function Playground() {
  const [showCards, setShowCards] = useState(false);
  const [randomLocation, setRandomLocation] = useState<Location | null>(null);
  const [maxDistance, setMaxDistance] = useState(10);
  const [showHiddenCards, setShowHiddenCards] = useState(false);
  const [originCoords, setOriginCoords] = useState({ lat: 42.0451, lon: -87.6877 });
  const [originAddress, setOriginAddress] = useState('Evanston, IL');
  const [address, setAddress] = useState('');
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(true);
  const [locations, setLocations] = useState<Location[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isLocationSet, setIsLocationSet] = useState(false);

  const fetchLocations = useCallback(async () => {
    setIsLoading(true);
    try {
      const fetchedLocations = USE_MOCK_DATA
        ? await mockFetchLocations(originCoords.lat, originCoords.lon)
        : await fetchRealLocations(originCoords.lat, originCoords.lon);
      setLocations(fetchedLocations);
    } catch (error) {
      console.error('Error fetching locations:', error);
      // Optionally, set an error state here to display to the user
    } finally {
      setIsLoading(false);
    }
  }, [originCoords]);

  const handleGenerateIdeas = useCallback(() => {
    fetchLocations();
  }, [fetchLocations]);

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
    setOriginAddress(suggestion.display_name);
    setOriginCoords({
      lat: parseFloat(suggestion.lat),
      lon: parseFloat(suggestion.lon),
    });
    setSuggestions([]);
    setShowSuggestions(false);
    setIsLocationSet(true);
  };

  const [locationPreferences, setLocationPreferences] = useLocalStorage(
    'locationPreferences',
    { hidden: [], snoozed: {} }
  );
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const isLocationSnoozed = useCallback(
    (location: Location) => {
      const snoozedUntil = locationPreferences.snoozed[location.name];
      return snoozedUntil && Number(snoozedUntil) > Date.now();
    },
    [locationPreferences.snoozed]
  );

  const filteredLocations = useMemo(() => {
    if (!isClient) return [];
    return locations.filter((location: Location) => {
      const distance = calculateDistance(
        originCoords.lat,
        originCoords.lon,
        location.latitude,
        location.longitude
      );
      const distanceIsInRange = distance <= maxDistance;
      const isHidden = locationPreferences.hidden.includes(location.name);
      return distanceIsInRange && !isHidden;
    });
  }, [locations, maxDistance, locationPreferences.hidden, isClient, originCoords]);

  const generateRandomLocation = useCallback(() => {
    if (filteredLocations.length > 0) {
      const randomIndex = Math.floor(Math.random() * filteredLocations.length);
      setRandomLocation(filteredLocations[randomIndex]);
    } else {
      alert("No locations match your current filters. Try increasing the max distance or showing hidden locations.");
    }
  }, [filteredLocations]);

  const hiddenLocations = useMemo(() => {
    if (!isClient) return [];
    return locations.filter(
      (location: Location) =>
        locationPreferences.hidden.includes(location.name) ||
        isLocationSnoozed(location)
    );
  }, [
    locations,
    locationPreferences.hidden,
    locationPreferences.snoozed,
    isClient,
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
          setOriginAddress(coordsString);
          setAddress(coordsString);
          setIsLocationSet(true);

          // Attempt to get a readable address
          const readableAddress = await reverseGeocode(newCoords.lat, newCoords.lon);
          if (readableAddress) {
            setAddress(readableAddress);
            setOriginAddress(readableAddress);
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

  const handleSliderChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setMaxDistance(Number(event.target.value));
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
      <div className="mt-4">
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
      <div className="flex justify-between mb-4 w-full">
        <button
          className="rounded-lg p-4 text-primary font-semibold"
          onClick={() => setShowCards(!showCards)}
        >
          {showCards ? 'Hide All' : 'Show All'}
        </button>
        <div className="flex flex-col items-center w-full">
          {isLocationSet && (
            <button
              className="rounded-lg p-4 bg-primary text-white"
              onClick={handleGenerateIdeas}
              disabled={isLoading}
            >
              {isLoading ? 'Generating Ideas...' : 'Generate Ideas'}
            </button>
          )}
          {USE_MOCK_DATA && (
            <span className="mt-2 text-sm text-yellow-600 font-semibold">
              Using Mocked Data
            </span>
          )}
        </div>
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
      
     

      {isLoading ? (
        <div className="mt-4 text-center">Loading locations...</div>
      ) : (
        <>
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
                  snoozedUntil={locationPreferences.snoozed[location.name]}
                />
              ))}
            </div>
          )}

          {randomLocation && Object.keys(randomLocation).length > 0 && (
            <div className="mt-4">
              <LocationCard
                key={randomLocation.name}
                location={randomLocation}
                onHide={handleHideLocation}
                onSnooze={handleSnoozeLocation}
                isHidden={false}
                showMapByDefault={true}
                originAddress={originAddress}
                snoozedUntil={locationPreferences.snoozed[randomLocation.name]}
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
                      snoozedUntil={locationPreferences.snoozed[location.name]}
                    />
                  ))}
                </div>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}
