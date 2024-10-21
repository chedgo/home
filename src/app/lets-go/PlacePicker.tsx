// 'use client';
// import React, { useState, useCallback, useMemo, useEffect } from 'react';
// import { LocationCard } from '../../components/LocationCard';
// import { Location } from '@/app/api/decks/schema';
// import { calculateDistance } from '../../utils/locationUtils';
// // import { DeckSelector } from './DeckSelector';
// import { DistanceSlider } from './DistanceSlider';
// import { Modal } from '../../components/Modal';

// interface PlacePickerProps {
//   deck: Deck;
//   setDecks: React.Dispatch<React.SetStateAction<Deck[]>>;
// }

// export default function DeckBuilder({ deck }: PlacePickerProps) {
//   const [showCards, setShowCards] = useState(false);
//   const [randomLocation, setRandomLocation] = useState<Location | null>(null);
//   const [maxDistance, setMaxDistance] = useState(10);
//   const [showHiddenCards, setShowHiddenCards] = useState(false);
//   const [generationCount, setGenerationCount] = useState(0);
//   const [lastGenerationTime, setLastGenerationTime] = useState<number | null>(
//     null
//   );
//   const [modalState, setModalState] = useState<{
//     isOpen: boolean;
//     title: string;
//     content: React.ReactNode;
//     onConfirm: () => void;
//   }>({
//     isOpen: false,
//     title: '',
//     content: null,
//     onConfirm: () => {},
//   });

//   useEffect(() => {
//     const storedData = localStorage.getItem(`deck_${deck?.id}`);
//     if (storedData) {
//       const { count, time } = JSON.parse(storedData);
//       setGenerationCount(count);
//       setLastGenerationTime(time);
//     } else {
//       setGenerationCount(0);
//       setLastGenerationTime(null);
//     }
//   }, [deck]);

//   const filteredLocations = useMemo(() => {
//     return deck.locations.filter((location: Location) => {
//       const distance = calculateDistance(
//         deck.coords.lat,
//         deck.coords.lon,
//         location.coords.lat,
//         location.coords.lon
//       );
//       const distanceIsInRange = distance <= maxDistance;
//       const isHidden = location.isHidden;
//       const isSnoozed =
//         location.snoozedUntil && location.snoozedUntil > Date.now();
//       return distanceIsInRange && !isHidden && !isSnoozed;
//     });
//   }, [deck, maxDistance]);

//   const hiddenLocations = useMemo(() => {
//     return deck.locations.filter(
//       (location: Location) =>
//         location.isHidden ||
//         (location.snoozedUntil && location.snoozedUntil > Date.now())
//     );
//   }, [deck]);

//   // const handleHideLocation = useCallback(
//   //   (name: string) => {
//   //     const updatedDecks = decks.map((deck, index) => {
//   //       if (index === currentDeckIndex) {
//   //         return {
//   //           ...deck,
//   //           locations: deck.locations.map((loc) =>
//   //             loc.name === name ? { ...loc, isHidden: !loc.isHidden } : loc
//   //           ),
//   //         };
//   //       }
//   //       return deck;
//   //     });
//   //     setDecks(updatedDecks);
//   //   },
//   //   [decks, currentDeckIndex, setDecks]
//   // );

//   // const handleSnoozeLocation = useCallback(
//   //   (name: string, duration: string) => {
//   //     const durationInMs = parseDuration(duration);
//   //     const snoozedUntil =
//   //       durationInMs > 0 ? Date.now() + durationInMs : undefined;

//   //     const updatedDecks = decks.map((deck, index) => {
//   //       if (index === currentDeckIndex) {
//   //         return {
//   //           ...deck,
//   //           locations: deck.locations.map((loc) =>
//   //             loc.name === name ? { ...loc, snoozedUntil } : loc
//   //           ),
//   //         };
//   //       }
//   //       return deck;
//   //     });
//   //     setDecks(updatedDecks);
//   //   },
//   //   [decks, currentDeckIndex, setDecks]
//   // );

//   const generateRandomLocation = useCallback(() => {
//     if (filteredLocations.length > 0) {
//       const randomIndex = Math.floor(Math.random() * filteredLocations.length);
//       setRandomLocation(filteredLocations[randomIndex]);
//     } else {
//       alert(
//         'No locations match your current filters. Try increasing the max distance or showing hidden locations.'
//       );
//     }
//   }, [filteredLocations]);

//   const handleSliderChange = (event: React.ChangeEvent<HTMLInputElement>) => {
//     setMaxDistance(Number(event.target.value));
//   };

//   const handleGenerateRandomLocation = useCallback(() => {
//     const currentTime = Date.now();
//     if (
//       lastGenerationTime &&
//       currentTime - lastGenerationTime < 12 * 60 * 60 * 1000
//     ) {
//       if (generationCount === 0) {
//         setModalState({
//           isOpen: true,
//           title: 'Commit to Your Adventure',
//           content:
//             'Are you sure you want to generate a random location? Remember, the goal is to commit to the first place picked!',
//           onConfirm: () => {
//             setGenerationCount(1);
//             generateRandomLocation();
//             setLastGenerationTime(currentTime);
//             localStorage.setItem(
//               `deck_${deck.id}`,
//               JSON.stringify({ count: 1, time: currentTime })
//             );
//           },
//         });
//       } else if (generationCount === 1) {
//         setModalState({
//           isOpen: true,
//           title: 'Warning: Multiple Generations Attempted',
//           content:
//             'Generating a second location kind of defeats the purpose. Are you sure you want to continue?',
//           onConfirm: () => {
//             setGenerationCount(2);
//             localStorage.setItem(
//               `deck_${deck.id}`,
//               JSON.stringify({ count: 2, time: currentTime })
//             );
//           },
//         });
//       } else if (generationCount === 2) {
//         setModalState({
//           isOpen: true,
//           title: 'Warning: Multiple Generations Attempted',
//           content:
//             "Okay but don't say I didn't warn you. It will all seem meaningless.",
//           onConfirm: () => {
//             setGenerationCount(3);
//             generateRandomLocation();
//             setLastGenerationTime(currentTime);
//             setModalState((prev) => ({ ...prev, isOpen: false }));
//             localStorage.setItem(
//               `deck_${deck.id}`,
//               JSON.stringify({ count: 3, time: currentTime })
//             );
//           },
//         });
//       } else {
//         setModalState({
//           isOpen: true,
//           title: 'No More Generations',
//           content:
//             "You've reached the maximum number of generations. Get going!",
//           onConfirm: () =>
//             setModalState((prev) => ({ ...prev, isOpen: false })),
//         });
//       }
//     } else {
//       setGenerationCount(1);
//       setLastGenerationTime(currentTime);
//       localStorage.setItem(
//         `deck_${deck.id}`,
//         JSON.stringify({ count: 1, time: currentTime })
//       );
//       generateRandomLocation();
//     }
//   }, [generationCount, lastGenerationTime, deck, generateRandomLocation]);

//   const buttonText = useMemo(() => {
//     if (generationCount === 0) {
//       return 'Woe is me, the paradox of choice has me paralyzed. I wish someone would just pick one for me.';
//     } else if (generationCount === 3) {
//       return "That's it! (for real this time)";
//     } else {
//       return "That's it!";
//     }
//   }, [generationCount]);

//   return (
//     <>
//       {
//         <>
//           <div className="flex justify-between items-center mb-4 w-full">
//             <DistanceSlider
//               maxDistance={maxDistance}
//               onChange={handleSliderChange}
//             />
//             {/* <DeckSelector
//               decks={decks}
//               currentDeckIndex={currentDeckIndex}
//               onDeckChange={setCurrentDeckIndex}
//               /> */}
//             <div className="flex space-x-2">
//               <button
//                 className="rounded-lg px-3 py-2 text-primary font-semibold"
//                 onClick={() => setShowCards(!showCards)}
//               >
//                 {showCards ? 'Hide All' : 'Show All'}
//               </button>
//               <div className="rounded-lg px-3 py-2 bg-secondary text-white">
//                 Build Deck
//               </div>
//             </div>
//           </div>

//           <div className="mb-4 w-full">
//             <button
//               className="w-full rounded-lg p-4 bg-primary text-white"
//               onClick={handleGenerateRandomLocation}
//             >
//               {buttonText}
//             </button>
//           </div>

//           {randomLocation && (
//             <div className="mt-4">
//               <LocationCard
//                 key={randomLocation.name}
//                 location={randomLocation}
//                 showMapByDefault
//                 originAddress={deck.address}
//               />
//             </div>
//           )}

//           {showCards && (
//             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
//               {filteredLocations.map((location, index) => (
//                 <LocationCard
//                   key={index}
//                   location={location}
//                   originAddress={deck.address}
//                 />
//               ))}
//             </div>
//           )}

//           <div className="mt-8">
//             <button
//               className="rounded-lg p-4 text-primary font-semibold"
//               onClick={() => setShowHiddenCards(!showHiddenCards)}
//             >
//               {showHiddenCards ? 'Hide' : 'Show'} Hidden and Snoozed Locations
//               {` (${hiddenLocations.length})`}
//             </button>

//             {showHiddenCards && hiddenLocations.length > 0 && (
//               <div className="mt-4">
//                 <h2 className="text-xl font-bold mb-4">
//                   Hidden and Snoozed Locations
//                 </h2>
//                 <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
//                   {hiddenLocations.map((location, index) => (
//                     <LocationCard
//                       key={index}
//                       location={location}
//                       originAddress={deck.address}
//                     />
//                   ))}
//                 </div>
//               </div>
//             )}
//           </div>
//         </>
//       }

//       <Modal
//         isOpen={modalState.isOpen}
//         onClose={() => setModalState((prev) => ({ ...prev, isOpen: false }))}
//         onConfirm={modalState.onConfirm}
//         title={modalState.title}
//       >
//         <p>{modalState.content}</p>
//       </Modal>
//     </>
//   );
// }
