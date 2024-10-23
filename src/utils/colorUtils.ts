import { ColorName as ColorNameType } from '@/types';
import colorNameData from '../app/color_names.json';

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

export const getNearestColorName = (hexColor: string): string => {
  let closestColor = '';
  let minDistance = Infinity;

  for (const [name, data] of Object.entries(colorNames)) {
    const distance = calculateColorDistance(hexColor, data.hex);
    if (distance < minDistance) {
      minDistance = distance;
      closestColor = name;
    }
  }
  return colorNames[closestColor].name;
};
