import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./src/**/*.{js,ts,jsx,tsx}'], // Adjust this to match your directory
  theme: {
    colors: {
      base: '#0f0f0f',
      surface: '#1a1a1a',
      primary: '#ff5c8a',
      'primary-light': '#ff85a2',
      accent: '#ffd700',
      'accent-blue': '#00bcd4',
      'text-main': '#e5e5e5',
      white: '#ffffff',
      black: '#000000',
      transparent: 'transparent',
      current: 'currentColor',
    },
    extend: {
      // Add other extensions (spacing, fontFamily, etc.) here
    },
  },
  plugins: [],
};

export default config;
