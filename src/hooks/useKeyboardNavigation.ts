import { useState, KeyboardEvent } from 'react';

export const useKeyboardNavigation = (itemsCount: number) => {
  const [selectedIndex, setSelectedIndex] = useState<number>(-1);

  const handleKeyDown = (
    e: KeyboardEvent<HTMLInputElement>,
    onEnter: () => void
  ) => {
    if (itemsCount === 0) return;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setSelectedIndex((prevIndex) =>
          prevIndex < itemsCount - 1 ? prevIndex + 1 : prevIndex
        );
        break;
      case 'ArrowUp':
        e.preventDefault();
        setSelectedIndex((prevIndex) => (prevIndex > 0 ? prevIndex - 1 : 0));
        break;
      case 'Enter':
        e.preventDefault();
        if (selectedIndex >= 0 && selectedIndex < itemsCount) {
          onEnter();
        }
        break;
    }
  };

  return { selectedIndex, handleKeyDown };
};
