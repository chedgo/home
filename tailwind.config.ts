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
        'dashiell-bright': ['"Dashiell Bright"', 'serif'],
        'tenon': ['"Tenon"', 'serif'],
        'tenon-bold': ['"Tenon"', 'serif'],
        'tenon-extrabold': ['"Tenon"', 'serif'],
      },
    },
  },
  plugins: [],
};

export default config;
