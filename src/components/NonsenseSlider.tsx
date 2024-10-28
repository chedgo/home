import { useMemo } from 'react';

interface NonsenseSliderProps {
  temperature: number;
  onTemperatureChange: (value: number) => void;
}

export function NonsenseSlider({ temperature, onTemperatureChange }: NonsenseSliderProps) {
  const temperatureLabels = useMemo(
    () => [
      { value: 0, label: 'Is this poetry?' },
      { value: 10, label: 'Quirky' },
      { value: 20, label: 'Eccentric' },
      { value: 30, label: 'Surreal' },
      { value: 40, label: 'Nonsensical' },
      { value: 50, label: 'What?!' },
    ],
    []
  );

  const getCurrentLabel = () => {
    const currentLabel = temperatureLabels.reduce((prev, curr) => {
      return Math.abs(curr.value - temperature) < Math.abs(prev.value - temperature)
        ? curr
        : prev;
    });
    return currentLabel.label;
  };

  return (
    <>
      <h2 className="text-2xl font-semibold mt-10 mb-4 text-primary">
        How much nonsense?
      </h2>
      <div className="w-full relative">
        <input
          id="nonsense-slider"
          type="range"
          min="0"
          max="50"
          value={temperature}
          onChange={(e) => onTemperatureChange(parseInt(e.target.value))}
          className="w-full h-2 bg-gray-200 rounded-lg cursor-pointer mb-6"
        />
        <div className="w-full flex justify-between px-2 mt-2">
          {temperatureLabels.map(({ value, label }) => (
            <span
              key={value}
              className={`text-xs ${
                Math.abs(value - temperature) <= 5
                  ? 'font-bold'
                  : 'text-gray-500'
              }`}
              style={{
                left: `${(value / 50) * 100}%`,
                transform: 'translateX(-50%)',
              }}
            >
              {label}
            </span>
          ))}
        </div>
      </div>
      <p className="text-center mt-2 mb-4">
        Current setting: <strong>{getCurrentLabel()}</strong>
      </p>
    </>
  );
}
