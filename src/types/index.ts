export type Location = {
  name: string;
  description: string;
  wikipedia_link: string | null;
  latitude: number;
  longitude: number;
  isHidden?: boolean;
  snoozedUntil?: number;
};

export type Deck = {
  name: string;
  locations: Location[];
  address: string;
  coords: { lat: number; lon: number };
};