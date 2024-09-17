import { useEffect, useState } from 'react';

/**
 * Custom hook to determine if the component is mounted.
 */
export const useIsMounted = () => {
  const [isMounted, setIsMounted] = useState(false);
  useEffect(() => {
    setIsMounted(true);
  }, []);
  return isMounted;
};
