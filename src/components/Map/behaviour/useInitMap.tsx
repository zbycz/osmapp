import React from 'react';
import maplibregl from 'maplibre-gl';
import { basicStyle } from '../styles/basicStyle';
import { PersistedScaleControl } from './PersistedScaleControl';
import { setUpHover } from './featureHover';
import { layersWithOsmId } from '../helpers';

const geolocateControl = new maplibregl.GeolocateControl({
  positionOptions: {
    enableHighAccuracy: true,
  },
  trackUserLocation: true,
});

const navigationControl = new maplibregl.NavigationControl({
  showCompass: true,
  showZoom: true,
  visualizePitch: true,
});

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
    setMapInState(map);

    map.addControl(navigationControl);
    map.addControl(geolocateControl);
    map.addControl(PersistedScaleControl as any);
    setUpHover(map, layersWithOsmId);

    return () => {
      map.remove();
    };
  }, [mapRef]);

  return [mapInState, mapRef];
};
