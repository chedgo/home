'use client';
import { useState } from 'react';
import { HexColorPicker } from 'react-colorful';

function ColorStories() {
  const [color, setColor] = useState("#aabbcc");

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
        <h2 className="text-2xl font-semibold mb-4 text-primary">Pick a Color</h2>
        <HexColorPicker color={color} onChange={setColor} />
        <p className="mt-4 text-lg font-medium text-primary">
          Selected color: <span style={{ color: color }}>{color}</span>
        </p>
      </div>
    </div>
  );
}

export default ColorStories;
