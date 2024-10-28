'use client';
import { useState, useMemo } from 'react';
import { HexColorPicker } from 'react-colorful';
import { getNearestColorName } from '@/utils/colorUtils';
import { useFetchColorStory } from '@/hooks/useFetchColorStory';
import { Color } from '@/types/Color';
import { colorFromHex } from '@/utils/colorUtils';

function ColorStories() {
  const [temperature, setTemperature] = useState<number>(1);
  const [color, setColor] = useState<Color>({
    name: 'Red',
    hex: '#ff0000',
    red: 255,
    green: 0,
    blue: 0,
    hue: 0,
    saturation: 0,
    value: 0,
  });
  const handleColorChange = (hex: string) => {
    setColor(colorFromHex(hex));
  };
  const { story, isLoading, error, fetchStory } = useFetchColorStory();

  const temperatureLabels = useMemo(() => [
    { value: 0, label: "Is this poetry?" },
    { value: 10, label: "Quirky" },
    { value: 20, label: "Eccentric" },
    { value: 30, label: "Surreal" },
    { value: 40, label: "Nonsensical" },
    { value: 50, label: "What?!" }
  ], []);

  const getCurrentLabel = () => {
    const currentLabel = temperatureLabels.reduce((prev, curr) => {
      return (Math.abs(curr.value - temperature) < Math.abs(prev.value - temperature) ? curr : prev);
    });
    return currentLabel.label;
  };

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold mb-6 text-center text-primary">
        Color Stories
      </h1>

      <section className="mb-8 space-y-4 text-primary">
        <p>
          This is a proof of concept towards an embedded toy I&apos;m working
          on. Shamelessly inspired by the poetry camera{' '}
          <a href="https://poetry.camera/" target="_blank">
            https://poetry.camera/
          </a>{' '}
          and tiny color poems{' '}
          <a href="https://x.com/tinyColorPoems" target="_blank">
            https://x.com/tinyColorPoems
          </a>
        </p>
        <p>
          Pick a color and generate a story. The finished object will be a
          physical toy using an esp32 with a color sensor, running a local gpt
          to generate stories of significantly more dubious quality. To mimic
          this, I&apos;m using the openai gpt-4o-mini model and dialed the
          temperature up to just past the line of unintelligability.
        </p>
      </section>

      <div className="flex flex-col items-center mb-8">
        <h2 className="text-2xl font-semibold mb-4 text-primary">
          Pick a Color
        </h2>
        <HexColorPicker color={color.hex} onChange={handleColorChange} />
        <p className="mt-4 text-lg font-medium text-primary">
          Selected color:{' '}
          <span style={{ color: color.hex }}>
            {getNearestColorName(color.hex)}
          </span>
        </p>
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
            onChange={(e) => setTemperature(parseInt(e.target.value))}
            className="w-full h-2 bg-gray-200 rounded-lg cursor-pointer mb-6"
          />
          <div className="w-full flex justify-between px-2 mt-2">
            {temperatureLabels.map(({ value, label }) => (
              <span
                key={value}
                className={`text-xs ${
                  Math.abs(value - temperature) <= 5 ? 'font-bold' : 'text-gray-500'
                }`}
                style={{ left: `${(value / 50) * 100}%`, transform: 'translateX(-50%)' }}
              >
                {label}
              </span>
            ))}
          </div>
        </div>
        <p className="text-center mt-2 mb-4">
          Current setting: <strong>{getCurrentLabel()}</strong>
        </p>
        <button
          className="bg-primary text-white px-4 py-2 rounded-md"
          onClick={() => {
            fetchStory(color, temperature);
          }}
        >
          Tell me a story
        </button>
        {isLoading && <p>Loading...</p>}
        {error && <p>Error: {error}</p>}
        {story && (
          <div className="mt-4">
            <h3 className="text-xl font-semibold mb-2">Generated Story</h3>
            <ul className="list-disc list-inside">
              <li>{story.text}</li>
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}

export default ColorStories;
