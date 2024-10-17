export type Location = {
  name: string;
  description: string;
  wikipedia_link: string | null;
  coords: Coordinates;
  isHidden?: boolean;
  snoozedUntil?: number;
};

export type Deck = {
  id: string;
  name: string;
  locations: Location[];
  address: string;
  coords: Coordinates;
};

export type Coordinates = {
  lat: number;
  lon: number;
};
