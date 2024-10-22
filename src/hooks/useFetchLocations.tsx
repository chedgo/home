import { Coordinates } from '@/types';
import {
  destinationSchema,
  partialDestination,
} from '@/app/api/locations/schema';
import { useCallback, useState } from 'react';
import { experimental_useObject as useObject } from 'ai/react';

export function useFetchDestinations() {
  const { submit, isLoading, object } = useObject<{
    destinations: partialDestination[];
  }>({
    api: '/api/locations',
    schema: destinationSchema,
  });
  const [isDoneLoading, setIsDoneLoading] = useState(false);

  const fetchDestinations = useCallback(
    (coords: Coordinates, activities: string[], maxDistance: number) => {
      if (!coords || activities.length === 0 || maxDistance === 0) {
        return;
      }
      setIsDoneLoading(false);

      submit({
        latitude: coords.lat,
        longitude: coords.lon,
        activities: activities.join(','),
        maxDistance,
      });
      setIsDoneLoading(true);
    },
    [submit]
  );

  return {
    fetchDestinations,
    isLoading,
    destinations: [
      {
        name: 'Millennium Park',
        description:
          'A large public park in the heart of Chicago, known for its modern architecture, gardens, and art installations.',
        wikipedia_link: 'https://en.wikipedia.org/wiki/Millennium_Park',
        coords: {
          lat: '41.8826',
          lon: '-87.6233',
        },
        explanation:
          "Millennium Park is a photographer's paradise with its iconic Cloud Gate sculpture, beautiful gardens, and stunning skyline views.",
      },
      {
        name: 'The Art Institute of Chicago',
        description:
          'One of the oldest and largest art museums in the United States, featuring an extensive collection of artworks.',
        wikipedia_link:
          'https://en.wikipedia.org/wiki/Art_Institute_of_Chicago',
        coords: {
          lat: '41.9794',
          lon: '-87.6545',
        },
        explanation:
          "The Art Institute's stunning architecture and vast collection of art provide endless opportunities for photography.",
      },
      {
        name: 'Navy Pier',
        description:
          'A popular tourist destination on the Chicago shoreline, featuring entertainment, dining, and beautiful views of Lake Michigan.',
        wikipedia_link: 'https://en.wikipedia.org/wiki/Navy_Pier',
        coords: {
          lat: '41.8916',
          lon: '-87.6052',
        },
        explanation:
          'Navy Pier offers vibrant colors, unique structures, and picturesque views of the lake and city skyline.',
      },
      {
        name: 'Lincoln Park Zoo',
        description:
          'A free, historic zoo located in Lincoln Park, home to a variety of animals and beautiful landscapes.',
        wikipedia_link: 'https://en.wikipedia.org/wiki/Lincoln_Park_Zoo',
        coords: {
          lat: '41.9213',
          lon: '-87.6320',
        },
        explanation:
          "The zoo's lush gardens and diverse animal exhibits make it a great spot for nature and wildlife photography.",
      },
      {
        name: 'Chicago Riverwalk',
        description:
          'A scenic waterfront path along the Chicago River, featuring restaurants, parks, and stunning views of the city.',
        wikipedia_link: 'https://en.wikipedia.org/wiki/Chicago_Riverwalk',
        coords: {
          lat: '41.8853',
          lon: '-87.6280',
        },
        explanation:
          "The Riverwalk provides unique perspectives of the city's architecture and vibrant river life.",
      },
      {
        name: 'The Field Museum',
        description:
          'A natural history museum that houses a vast range of specimens, including Sue, the famous T. rex skeleton.',
        wikipedia_link: 'https://en.wikipedia.org/wiki/Field_Museum',
        coords: {
          lat: '41.8642',
          lon: '-87.6169',
        },
        explanation:
          "The museum's impressive exhibits and architecture offer great photo opportunities.",
      },
      {
        name: 'Grant Park',
        description:
          'A large urban park in downtown Chicago, known for its gardens, fountains, and cultural events.',
        wikipedia_link: 'https://en.wikipedia.org/wiki/Grant_Park',
        coords: {
          lat: '41.8762',
          lon: '-87.6200',
        },
        explanation:
          "Grant Park's beautiful landscapes and iconic Buckingham Fountain are perfect for photography.",
      },
      {
        name: 'Chicago Botanical Garden',
        description:
          'A stunning garden featuring a variety of plants, flowers, and themed gardens, located just outside the city.',
        wikipedia_link: 'https://en.wikipedia.org/wiki/Chicago_Botanic_Garden',
        coords: {
          lat: '42.1392',
          lon: '-87.6050',
        },
        explanation:
          "The Botanical Garden is a colorful and serene place, ideal for capturing nature's beauty.",
      },
      {
        name: 'Skydeck Chicago',
        description:
          'An observation deck located on the 103rd floor of the Willis Tower, offering breathtaking views of the city.',
        wikipedia_link: 'https://en.wikipedia.org/wiki/Skydeck_Chicago',
        coords: {
          lat: '41.8784',
          lon: '-87.6359',
        },
        explanation:
          "The panoramic views from Skydeck provide a unique perspective of Chicago's skyline.",
      },
      {
        name: 'The Museum of Science and Industry',
        description:
          'One of the largest science museums in the world, featuring interactive exhibits and historical artifacts.',
        wikipedia_link:
          'https://en.wikipedia.org/wiki/Museum_of_Science_and_Industry,_Chicago',
        coords: {
          lat: '41.7906',
          lon: '-87.5855',
        },
        explanation:
          "The museum's fascinating exhibits and architecture make it a great spot for photography.",
      },
    ],
    isDoneLoading,
  };
}
