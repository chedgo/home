'use client';
import React, { useState } from 'react';
import { DEFAULT_LOCATION } from '@/constants/locations';
import { Location } from '@/types';
import LocationAutocomplete from '@/components/LocationAutocomplete';
import { useFetchLocations } from '@/hooks/useFetchLocations';
import { DistanceSlider } from './DistanceSlider';

export default function LetsGo() {
  const toggleActivity = (activity: string) => {
    setSelectedActivities((prevActivities) => {
      if (prevActivities.includes(activity)) {
        return prevActivities.filter((a) => a !== activity);
      } else {
        return [...prevActivities, activity];
      }
    });
  };
  const activities = [
    'take photos',
    'eat',
    'drink',
    'read',
    'learn',
    'explore',
    'shop',
  ];
  const [selectedLocation, setSelectedLocation] =
    useState<Location>(DEFAULT_LOCATION);
  const [maxDistance, setMaxDistance] = useState(10);
  const [selectedActivities, setSelectedActivities] = useState<string[]>([
    activities[0],
  ]);
  const { fetchLocations, isLoading, locations } = useFetchLocations();
  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold mb-6 text-center text-primary">
        Let&apos;s Go
      </h1>

      <section className="mb-8 space-y-4 text-primary">
        <p>
          Sometimes you just want to go somewhere and don&apos;t know where to
          go. Sometimes we get caught wandering around the blockbuster longer
          than a movie&apos;s runtime. Sometimes being able to do everything
          makes it hard to do anything.
        </p>
        <p>
          This tool was made to help make a choice and{' '}
          <span className="text-accent font-bold font-tenon-bold">
            move on with your life
          </span>
          .
        </p>
        <p>
          A user can generate a deck of locations based on their preferences and
          then use the picker to randomly select a{' '}
          <span className="text-accent font-bold font-tenon-bold">
            single location
          </span>{' '}
          from the deck.
        </p>
        <p className="italic">
          This tool is not complete, but is already{' '}
          <span className="text-accent font-bold font-tenon-bold">
            useful for me
          </span>{' '}
          so I thought I&apos;d share as I build it out.
        </p>
      </section>
      <div>
        I am in{' '}
        <LocationAutocomplete
          location={selectedLocation}
          setLocation={setSelectedLocation}
        />
      </div>
      <div>I want to</div>
      <div className="flex flex-wrap gap-2">
        {activities.map((activity) => (
          <div
            className={`border border-primary rounded-full p-2 cursor-pointer w-fit text-primary ${
              selectedActivities.includes(activity)
                ? 'bg-primary text-white'
                : 'bg-white'
            }`}
            key={activity}
            onClick={() => {
              toggleActivity(activity);
            }}
          >
            {activity}
          </div>
        ))}
      </div>
      <DistanceSlider
        maxDistance={maxDistance}
        onChange={(e) => setMaxDistance(Number(e.target.value))}
      />
      <button
        className="border-2 border-primary text-primary mt-8 p-2"
        onClick={() =>
          fetchLocations(
            selectedLocation.coords,
            selectedActivities,
            maxDistance
          )
        }
      >
        Generate Ideas
      </button>
      {isLoading && <div>Loading...</div>}
      {locations && locations.length > 0 && (
        <div>
          {locations.map((location) => {
            if (!location || !location.coords) return null;

            return (
              <div key={`${location.coords.lat}-${location.coords.lon}`}>
                {location.name}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
