'use client';
import { useState } from 'react';

function ColorStories() {
  const [stories, setStories] = useState<string[]>([]);

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
          Pick a color and generate a story. finished object will be a physical
          toy using an esp32 with a color sensor and a speaker.
        </p>
        <p></p>
        <p className="italic">
        
        </p>
      </section>
    </div>
  );
}

export default ColorStories;
