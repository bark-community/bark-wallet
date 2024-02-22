import { useEffect, useMemo, useState } from 'react';
import { useLoading } from '../contexts/LoadingProvider';

export enum ColorScheme {
  Light = 'light',
  Dark = 'dark',
}

export const isWindowReady = typeof window !== 'undefined';

export function useWindowParam() {
  const { isLoading } = useLoading();

  const [windowSize, setWindowSize] = useState({
    width: -1,
    height: -1,
  });
  const [windowPosition, setWindowPosition] = useState({
    top: -1,
    left: -1,
  });
  const [colorScheme, setColorScheme] = useState(ColorScheme.Light);
  const [isOnline, setIsOnline] = useState(true);
  const isReady = useMemo(() => windowSize.width > 0 && !isLoading, [windowSize.width, isLoading]);

  useEffect(() => {
    const handleResize = () => {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
      setWindowPosition({
        top: window.screenTop,
        left: window.screenLeft,
      });
    };

    const handleColorScheme = (event: MediaQueryListEvent) => {
      setColorScheme(event.matches ? ColorScheme.Dark : ColorScheme.Light);
    };

    const resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const { width, height } = entry.contentRect;
        setWindowSize({ width, height });
      }
    });

    window.addEventListener('resize', handleResize);
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', handleColorScheme);
    window.addEventListener('online', () => setIsOnline(true), false);
    window.addEventListener('offline', () => setIsOnline(false), false);

    handleResize();
    setColorScheme(window.matchMedia('(prefers-color-scheme: dark)').matches ? ColorScheme.Dark : ColorScheme.Light);
    setIsOnline(window.navigator.onLine);
    resizeObserver.observe(document.body);

    return () => {
      window.removeEventListener('resize', handleResize);
      window.matchMedia('(prefers-color-scheme: dark)').removeEventListener('change', handleColorScheme);
      window.removeEventListener('online', () => setIsOnline(true));
      window.removeEventListener('offline', () => setIsOnline(false));
      resizeObserver.disconnect();
    };
  }, []); // Empty array ensures that effect is only run on mount

  useEffect(() => {
    document.documentElement.className = colorScheme;
  }, [colorScheme]);

  return {
    width: windowSize.width,
    height: windowSize.height,
    top: windowPosition.top,
    left: windowPosition.left,
    colorScheme,
    isOnline,
    isReady,
  };
}
