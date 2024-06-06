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
        accent: '#4f5f34',
        background: '#ffffff',
        foreground: '#ffffff',
      },
      fontFamily: {
        'darker-grotesque': ['"Darker Grotesque"', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
export default config;
