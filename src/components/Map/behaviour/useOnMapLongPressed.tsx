import { useEffect } from 'react';
import { isMobileDevice } from '../../helpers';
import { createCoordsFeature, pushFeatureToRouter } from './utils';

// https://stackoverflow.com/questions/43459539/mapbox-gl-js-long-tap-press
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
      const coordsFeature = createCoordsFeature(coords, map);
      setFeature(coordsFeature);
      pushFeatureToRouter(coordsFeature);
    };

    return emulatedLongPressListeners(map, showCoords);
  }, [map, setFeature]);
};
