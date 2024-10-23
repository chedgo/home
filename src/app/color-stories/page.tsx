'use client';
import { useState } from 'react';
import { HexColorPicker } from 'react-colorful';
import { ColorName as ColorNameType } from '@/types';
import colorNameData from '../color_names.json';

function ColorStories() {
  const [color, setColor] = useState('#aabbcc');
  const colorNames = colorNameData as ColorNameType;

  const hexToRgb = (hex: string) => {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return { r, g, b };
  };

  const calculateColorDistance = (hex1: string, hex2: string) => {
    const rgb1 = hexToRgb(hex1);
    const rgb2 = hexToRgb(hex2);
    return Math.sqrt(
      (rgb1.r - rgb2.r) ** 2 + (rgb1.g - rgb2.g) ** 2 + (rgb1.b - rgb2.b) ** 2
    );
  };

  const getNearestColorName = (hexColor: string) => {
    let closestColor = '';
    let minDistance = Infinity;

    for (const [name, data] of Object.entries(colorNames)) {
      const distance = calculateColorDistance(hexColor, data.hex);
      if (distance < minDistance) {
        minDistance = distance;
        closestColor = name;
      }
    }
    return closestColor;
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
          to generate stories of significantly more dubious quality. With a
          speaker.
        </p>
      </section>

      <div className="flex flex-col items-center mb-8">
        <h2 className="text-2xl font-semibold mb-4 text-primary">
          Pick a Color
        </h2>
        <HexColorPicker color={color} onChange={setColor} />
        <p className="mt-4 text-lg font-medium text-primary">
          Selected color:{' '}
          <span style={{ color: color }}>
            {colorNames[getNearestColorName(color)].name}
          </span>
        </p>
      </div>
    </div>
  );
}

export default ColorStories;
