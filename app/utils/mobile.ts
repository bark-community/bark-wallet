import { useWindowParam } from '../hooks/useWindowParam';

/**
 * Detects if the device is a mobile.
 * @returns {boolean} True if the device is a mobile, otherwise false.
 */
export function isMobileDevice(): boolean {
  return (
    typeof window !== 'undefined' &&
    window.isSecureContext &&
    typeof document !== 'undefined' &&
    /mobi|android/i.test(navigator.userAgent)
  );
}

/**
 * Detects if the screen size is a mobile size.
 * @param {number} maxWidth - The maximum width considered as a mobile size. Default is 768 pixels.
 * @returns {boolean} True if the screen size is a mobile size, otherwise false.
 */
export function isMobileSize(maxWidth: number = 768): boolean {
  return typeof window === 'undefined' || window.screen.availWidth < maxWidth;
}

/**
 * Hook to dynamically detect if the screen size is a mobile size.
 * @param {number} maxWidth - The maximum width considered as a mobile size. Default is 768 pixels.
 * @returns {boolean} True if the screen size is a mobile size, otherwise false.
 */
export function useIsMobile(maxWidth: number = 768): boolean {
  const { width } = useWindowParam();
  return width < maxWidth && width > 0;
}
