import { useState, useEffect, useCallback, useRef } from 'react';

const useLocalStorage = (key, initialValue) => {
  // Initialize state with value from localStorage or initialValue
  const [state, setState] = useState(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      return initialValue;
    }
  });

  // Ref to track if we've just set a new value
  const isNewValueRef = useRef(false);

  // Function to update state and localStorage
  const setValue = useCallback((value) => {
    try {
      // Allow value to be a function for previous state-based updates
      const valueToStore = value instanceof Function ? value(state) : value;
      setState(valueToStore);
      window.localStorage.setItem(key, JSON.stringify(valueToStore));
      isNewValueRef.current = true; // Mark that we've just set a new value
    } catch (error) {
      console.error('Error storing in localStorage:', error);
    }
  }, [key, state]);

  // Effect to sync state with other tabs/windows
  useEffect(() => {
    const handleStorageChange = (event) => {
      if (event.key === key && !isNewValueRef.current) {
        // Only update if the change was from another tab/window
        setState(JSON.parse(event.newValue));
      }
      isNewValueRef.current = false; // Reset the flag
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, [key]);

  return [state, setValue];
};

export default useLocalStorage;
