import React from 'react';
import maplibregl from 'maplibre-gl';
import { basicStyle } from '../styles/basicStyle';
import { PersistedScaleControl } from './PersistedScaleControl';
import { setGlobalMap } from '../../../services/mapStorage';
import { COMPASS_TOOLTIP } from '../useAddTopRightControls';

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
      locale: {
        'NavigationControl.ResetBearing': COMPASS_TOOLTIP,
      },
    });
    setGlobalMap(map);
    setMapInState(map);

    map.addControl(PersistedScaleControl as any);

    map.scrollZoom.setWheelZoomRate(1 / 200); // 1/450 is default, bigger value = faster

    map.on('styleimagemissing', (e) => {
      const width = 12;
      const data = new Uint8Array(width * width * 4);
      for (let x = 0; x < width; x++) {
        for (let y = 0; y < width; y++) {
          const offset = (y * width + x) * 4;
          data[offset + 0] = 255;
          data[offset + 1] = 0;
          data[offset + 2] = 0;
          data[offset + 3] = 255; // alpha
        }
      }
      map.addImage(e.id, { width, height: width, data });
    });

    return () => {
      setGlobalMap(null);
      map.remove();
    };
  }, [mapRef]);

  return [mapInState, mapRef];
};
