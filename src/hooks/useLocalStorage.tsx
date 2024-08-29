import { useState, useEffect, useCallback, useRef } from 'react';

function useLocalStorage<T>(key: string, initialValue: T): [T, (value: T | ((val: T) => T)) => void] {
  // Use a function to initialize state to ensure it's only called once
  const [state, setState] = useState<T>(() => initialValue);

  // Ref to track if we've just set a new value
  const isNewValueRef = useRef<boolean>(false);

  // Effect to initialize state from localStorage on client-side
  useEffect(() => {
    try {
      const item = window.localStorage.getItem(key);
      if (item) {
        setState(JSON.parse(item));
      }
    } catch (error) {
      console.error('Error reading from localStorage:', error);
    }
  }, [key]);

  // Function to update state and localStorage
  const setValue = useCallback((value: T | ((val: T) => T)) => {
    try {
      // Allow value to be a function for previous state-based updates
      const valueToStore = value instanceof Function ? value(state) : value;
      setState(valueToStore);
      if (typeof window !== 'undefined') {
        window.localStorage.setItem(key, JSON.stringify(valueToStore));
        isNewValueRef.current = true; // Mark that we've just set a new value
      }
    } catch (error) {
      console.error('Error storing in localStorage:', error);
    }
  }, [key, state]);

  // Effect to sync state with other tabs/windows
  useEffect(() => {
    const handleStorageChange = (event: StorageEvent) => {
      if (event.key === key && !isNewValueRef.current) {
        // Only update if the change was from another tab/window
        setState(event.newValue ? JSON.parse(event.newValue) : null);
      }
      isNewValueRef.current = false; // Reset the flag
    };

    if (typeof window !== 'undefined') {
      window.addEventListener('storage', handleStorageChange);
      return () => window.removeEventListener('storage', handleStorageChange);
    }
  }, [key]);

  return [state, setValue];
}

export default useLocalStorage;