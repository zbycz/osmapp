import React from 'react';
import maplibregl from 'maplibre-gl';
import { basicStyle } from '../styles/basicStyle';
import { PersistedScaleControl } from './PersistedScaleControl';
import { setGlobalMap } from '../../../services/mapStorage';

export const useInitMap = () => {
  const mapRef = React.useRef(null);
  const [mapInState, setMapInState] = React.useState(null);

  React.useEffect(() => {
    if (!mapRef.current) return undefined;

    const map = new maplibregl.Map({
      container: mapRef.current,
      style: basicStyle,
      attributionControl: false,
      refreshExpiredTiles: false,
    });
    setGlobalMap(map);
    setMapInState(map);

    map.addControl(PersistedScaleControl as any);

    map.scrollZoom.setWheelZoomRate(1 / 200); // 1/450 is default, bigger value = faster

    return () => {
      setGlobalMap(null);
      map.remove();
    };
  }, [mapRef]);

  return [mapInState, mapRef];
};
