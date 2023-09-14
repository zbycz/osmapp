import React from 'react';
import maplibregl from 'maplibre-gl';
import { basicStyle } from '../styles/basicStyle';
import { PersistedScaleControl } from './PersistedScaleControl';
import { setUpHover } from './featureHover';
import { layersWithOsmId } from '../helpers';
import { setGlobalMap } from '../../../services/mapStorage';

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
      maxPitch: 85 // todo only for zoom > 15 and outdoor

    });
    setGlobalMap(map);
    setMapInState(map);

    map.addControl(
      new maplibregl.TerrainControl({
        source: 'terrainSource',
        exaggeration: 1
      })
    );

    map.addControl(navigationControl);
    map.addControl(geolocateControl);
    map.addControl(PersistedScaleControl as any);
    setUpHover(map, layersWithOsmId);

    map.scrollZoom.setWheelZoomRate(1 / 200); // 1/450 is default, bigger value = faster

    return () => {
      setGlobalMap(null);
      map.remove();
    };
  }, [mapRef]);

  return [mapInState, mapRef];
};
