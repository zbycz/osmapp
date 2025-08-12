import { useBoolState } from '../helpers';
import React, { useCallback } from 'react';

export const useLoadingState = () => {
  const [isLoading, start, stop] = useBoolState(false);
  const timeout = React.useRef<NodeJS.Timeout>();

  return {
    isLoading,
    startLoading: useCallback(() => {
      timeout.current = setTimeout(start, 300);
    }, [start]),
    stopLoading: useCallback(() => {
      if (timeout.current) {
        clearTimeout(timeout.current);
        timeout.current = undefined;
      }
      stop();
    }, [stop]),
  };
};
