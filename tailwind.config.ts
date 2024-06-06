import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: '#2400FF',
        secondary: '#799351',
        accent: '#2400ff',
        background: '#FFFEFB',
        foreground: '#FFFEFB',
      },
      fontFamily: {
        'darker-grotesque': ['"Darker Grotesque"', 'sans-serif'],
        'averia-serif-libre-light': ['"Averia Serif Libre"', 'serif'],
        'averia-serif-libre-regular': ['"Averia Serif Libre"', 'serif'],
        'averia-serif-libre-bold': ['"Averia Serif Libre"', 'serif'],
        'averia-serif-libre-light-italic': ['"Averia Serif Libre"', 'serif'],
        'averia-serif-libre-regular-italic': ['"Averia Serif Libre"', 'serif'],
        'averia-serif-libre-bold-italic': ['"Averia Serif Libre"', 'serif'],
        'dm-sans': ['"DM Sans"', 'sans-serif'],
      },
    },
  },
  plugins: [],
};

export default config;
