import { Color, Color as ColorType } from '@/types/Color';
import colorNameData from '../app/color_names.json';

// Update the type assertion to match the actual structure of colorNameData
const colorNames: { [key: string]: ColorType } = colorNameData as {
  [key: string]: ColorType;
};

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

  for (const hex of Object.keys(colorNames)) {
    const distance = calculateColorDistance(hexColor, hex);
    if (distance < minDistance) {
      minDistance = distance;
      closestColor = hex;
    }
  }
  return colorNames[closestColor].name;
};
const hexToRgbHsv = (hex: string) => {
  // Remove the hash if present
  hex = hex.replace(/^#/, '');

  // Parse the hex string into red, green, and blue components
  const r = parseInt(hex.substring(0, 2), 16);
  const g = parseInt(hex.substring(2, 4), 16);
  const b = parseInt(hex.substring(4, 6), 16);

  // Normalize the red, green, and blue values to the range 0-1
  const rNorm = r / 255;
  const gNorm = g / 255;
  const bNorm = b / 255;

  // Find the maximum and minimum of the normalized values
  const cMax = Math.max(rNorm, gNorm, bNorm);
  const cMin = Math.min(rNorm, gNorm, bNorm);
  const delta = cMax - cMin;

  // Calculate Hue
  let hue = 0;
  if (delta === 0) {
    hue = 0;
  } else if (cMax === rNorm) {
    hue = ((gNorm - bNorm) / delta) % 6;
  } else if (cMax === gNorm) {
    hue = (bNorm - rNorm) / delta + 2;
  } else {
    hue = (rNorm - gNorm) / delta + 4;
  }
  hue = Math.round(hue * 60);
  if (hue < 0) hue += 360;

  // Calculate Saturation
  const saturation = cMax === 0 ? 0 : (delta / cMax) * 100;

  // Calculate Value (Brightness)
  const value = cMax * 100;

  return {
    red: r,
    green: g,
    blue: b,
    hue: hue,
    saturation: +saturation.toFixed(2),
    value: +value.toFixed(2),
  };
}

export const colorFromHex = (hex: string) => {
  const name = getNearestColorName(hex);
  const { red, green, blue, hue, saturation, value } = hexToRgbHsv(hex);
  return { name, hex, red, green, blue, hue, saturation, value } as Color;
}
