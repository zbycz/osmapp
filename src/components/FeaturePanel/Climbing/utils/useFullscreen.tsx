import { useState } from 'react';

export const useFullScreen = (elem: HTMLDivElement, options?: any) => {
  const [isFullScreenActive, setIsFullScreenActive] = useState(false);
  const enterFullscreen = () => {
    setIsFullScreenActive(true);
    return elem[
      [
        'requestFullscreen',
        'mozRequestFullScreen',
        'msRequestFullscreen',
        'webkitRequestFullscreen',
      ].find((prop) => typeof elem[prop] === 'function')
    ]?.(options);
  };

  const exitFullscreen = () => {
    setIsFullScreenActive(false);
    return document[
      [
        'exitFullscreen',
        'mozExitFullscreen',
        'msExitFullscreen',
        'webkitExitFullscreen',
      ].find((prop) => typeof document[prop] === 'function')
    ]?.();
  };
  return { enterFullscreen, exitFullscreen, isFullScreenActive };
};
