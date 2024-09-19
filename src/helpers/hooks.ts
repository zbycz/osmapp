import { useEffect } from 'react';

/**
 * A custom hook that console.logs the params on every change.
 * Usefull for debugging
 */
// eslint-disable-next-line no-restricted-syntax
export const useLog = (...params: any[]) => {
  useEffect(() => {
    // eslint-disable-next-line no-console
    console.log(...params);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [...params]);
};
