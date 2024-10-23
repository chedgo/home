import React, { useState } from 'react';
import Image from 'next/image';
import { Destination } from '@/app/api/locations/schema';

type GoogleMapProps = {
  destination: string;
  apiKey: string;
};

function GoogleMap({ destination, apiKey }: GoogleMapProps) {
  const encodedDestination = encodeURIComponent(destination);
  const src = `https://www.google.com/maps/embed/v1/place?key=${apiKey}&q=${encodedDestination}&zoom=15`;

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

export function DestinationCard({
  destination,
  showMapByDefault = false,
  onSelect,
  isSelected,
}: {
  destination: Destination;
  showMapByDefault?: boolean;
  onSelect: () => void;
  isSelected: boolean;
}) {
  const [showMap, setShowMap] = useState(showMapByDefault);

  return (
    <div
      className={`border-2 border-primary p-4 m-2 rounded-lg transition-shadow duration-300 ${
        isSelected ? 'bg-primary text-white' : ''
      }`}
      onClick={onSelect}
    >
      <div className="flex justify-between items-start mb-2">
        <h2 className="text-xl font-bold">{destination.name}</h2>
      </div>
      <p className="mb-2">{destination.description}</p>
      <div className="flex items-center mt-2 space-x-2">
        {destination.wikipedia_link && (
          <a
            href={destination.wikipedia_link}
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
              className={`object-contain hover:opacity-80 transition-opacity ${
                showMap ? 'opacity-50' : ''
              }`}
            />
          </div>
        </button>
      </div>

      {showMap && (
        <div className="mt-4">
          <GoogleMap
            destination={destination.name}
            apiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || ''}
          />
        </div>
      )}
    </div>
  );
}
