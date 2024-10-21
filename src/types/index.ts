// export type Destination = {
//   name: string;
//   description?: string;
//   wikipedia_link?: string | null;
//   coords: Coordinates;
//   explanation?: string;
//   isHidden?: boolean;
//   snoozedUntil?: number;
// };

// export type Deck = {
//   id: string;
//   name: string;
//   locations: Destination[];
//   address: string;
//   coords: Coordinates;
// };

export type Coordinates = {
  lat: number;
  lon: number;
};

export interface Place {
  display_name: string;
  lat: string;
  lon: string;
  address?: {
    country_code: string;
    city?: string;
    town?: string;
    village?: string;
  };
  addresstype?: string;
}
