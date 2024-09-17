import { useEffect, DependencyList } from 'react';

/**
 * Custom hook to listen for a specific keyDownEvent and trigger a callback.
 *
 * @param key - The key to listen for (e.g., "Enter", "Escape").
 * @param listener - The callback function to be invoked when the key is pressed.
 *
 * @example
 * ```typescript
 * useKeyDown('Escape', (e) => {
 *   console.log('Escape key was pressed');
 * });
 * ```
 */
export const useKeyDown = (
  key: string,
  listener: (e: KeyboardEvent) => void,
) => {
  useEffect(() => {
    const onKeydown = (e: KeyboardEvent) => {
      if (e.key === key) {
        listener(e);
      }
    };

    window.addEventListener('keydown', onKeydown);
    return () => {
      window.removeEventListener('keydown', onKeydown);
    };
  }, [key, listener]);
};
