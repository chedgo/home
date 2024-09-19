import React from 'react';

type DistanceSliderProps = {
  maxDistance: number;
  onSliderChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
};

export function DistanceSlider({ maxDistance, onSliderChange }: DistanceSliderProps) {
  return (
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
        onChange={onSliderChange}
        className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
      />
    </div>
  );
}