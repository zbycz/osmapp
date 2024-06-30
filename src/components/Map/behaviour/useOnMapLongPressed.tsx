import { useEffect } from 'react';
import { getRoundedPosition } from '../../../utils';
import { getCoordsFeature } from '../../../services/getCoordsFeature';
import { isMobileDevice } from '../../helpers';

const emulatedLongPressListeners = (map, eventHandler) => {
  let timeout = null;
  const clearIosTimeout = () => {
    clearTimeout(timeout);
  };
  const onTouchStart = (e) => {
    if (e.originalEvent.touches.length > 1) {
      return;
    }
    timeout = setTimeout(() => {
      eventHandler(e);
    }, 500);
  };
  map.on('touchstart', onTouchStart);
  map.on('touchend', clearIosTimeout);
  map.on('touchcancel', clearIosTimeout);
  map.on('touchmove', clearIosTimeout);
  map.on('pointerdrag', clearIosTimeout);
  map.on('pointermove', clearIosTimeout);
  map.on('moveend', clearIosTimeout);
  map.on('gesturestart', clearIosTimeout);
  map.on('gesturechange', clearIosTimeout);
  map.on('gestureend', clearIosTimeout);

  return () => {
    clearIosTimeout();
    map.off('touchstart', onTouchStart);
    map.off('touchend', clearIosTimeout);
    map.off('touchcancel', clearIosTimeout);
    map.off('touchmove', clearIosTimeout);
    map.off('pointerdrag', clearIosTimeout);
    map.off('pointermove', clearIosTimeout);
    map.off('moveend', clearIosTimeout);
    map.off('gesturestart', clearIosTimeout);
    map.off('gesturechange', clearIosTimeout);
    map.off('gestureend', clearIosTimeout);
  };
};

// const isIOS = () =>
//   [
//     'iPad Simulator',
//     'iPhone Simulator',
//     'iPod Simulator',
//     'iPad',
//     'iPhone',
//     'iPod',
//   ].includes(navigator.platform) ||
//   // iPad on iOS 13 detection
//   (navigator.userAgent.includes('Mac') && 'ontouchend' in document);
//
// // https://stackoverflow.com/questions/43459539/mapbox-gl-js-long-tap-press
// const longPressListeners = (map, eventHandler) => {
//   if (isIOS()) {
//     return emulatedLongPressListeners(map, eventHandler);
//   }
//
//   map.on('contextmenu', eventHandler);
//   return () => map.off('contextmenu', eventHandler);
// };

export const useOnMapLongPressed = (map, setFeature) => {
  useEffect(() => {
    if (!map) {
      return undefined;
    }

    if (!isMobileDevice()) {
      return undefined;
    }

    const showCoords = ({ point }) => {
      const coords = map.unproject(point).toArray();
      const roundedPosition = getRoundedPosition(coords, map.getZoom());
      setFeature(getCoordsFeature(roundedPosition));
    };

    return emulatedLongPressListeners(map, showCoords);
  }, [map, setFeature]);
};
