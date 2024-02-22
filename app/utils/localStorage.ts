import { useEffect, useRef, useState, type Dispatch, type SetStateAction } from 'react';

export function useLocalStorage<T>(key: string, defaultState: T): [T, Dispatch<SetStateAction<T>>] {
  const [state, setState] = useState<T>(() => {
    try {
      const value = localStorage.getItem(key);
      if (value) return JSON.parse(value) as T;
    } catch (error: any) {
      if (typeof window !== 'undefined') {
        console.error(error);
      }
    }

    return defaultState;
  });

  const isFirstRenderRef = useRef(true);

  useEffect(() => {
    if (!key) {
      console.warn('useLocalStorage: key is not defined');
      return;
    }

    if (isFirstRenderRef.current) {
      isFirstRenderRef.current = false;
      return;
    }

    try {
      if (state === undefined) {
        localStorage.removeItem(key);
      } else {
        localStorage.setItem(key, JSON.stringify(state));
      }
    } catch (error: any) {
      if (typeof window !== 'undefined') {
        console.error(error);
      }
    }
  }, [state, key]); // Use the state callback function instead of the value

  return [state, setState];
}
