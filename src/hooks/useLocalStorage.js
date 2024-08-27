import { useState, useEffect } from 'react';

const useLocalStorage = (key, initialValue) => {
  const [state, setState] = useState(initialValue);

  useEffect(() => {
    // Initialize state from localStorage
    const valueInLocalStorage = window.localStorage.getItem(key);
    if (valueInLocalStorage) {
      setState(JSON.parse(valueInLocalStorage));
    }

    // Set up localStorage update
    const updateLocalStorage = () => {
      window.localStorage.setItem(key, JSON.stringify(state));
    };
    updateLocalStorage();

    // Add event listener for storage changes
    window.addEventListener('storage', updateLocalStorage);

    // Clean up
    return () => {
      window.removeEventListener('storage', updateLocalStorage);
    };
  }, [key, state]);

  return [state, setState];
};

export default useLocalStorage;
