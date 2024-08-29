import React, { useState, useEffect, useMemo } from 'react';
import Image from 'next/image';

type Location = {
  name: string;
  description: string;
  wikipedia_link: string | null;
  latitude: number;
  longitude: number;
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

export function LocationCard({
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
  onSnooze: (name: string, duration: string) => void;
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

  const handleSnooze = () => {
    if (isSnoozed) {
      onSnooze(location.name, '0 minutes'); // Unsnooze
    } else {
      onSnooze(location.name, '90 days'); // Snooze for 3 months
    }
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
                onChange={handleSnooze}
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