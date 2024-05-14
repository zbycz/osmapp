import { useEffect } from 'react';
import maplibregl from 'maplibre-gl';
import { getGlobalMap } from '../../services/mapStorage';

const navigation = {
  mobile: new maplibregl.NavigationControl({
    showZoom: false,
    showCompass: true,
    visualizePitch: true,
  }),
  desktop: new maplibregl.NavigationControl({
    showZoom: true,
    showCompass: true,
    visualizePitch: true,
  }),
};

const geolocation = new maplibregl.GeolocateControl({
  positionOptions: {
    enableHighAccuracy: true,
  },
  trackUserLocation: true,
});

export const useAddTopRightControls = (map: any, mobileMode: boolean) => {
  useEffect(() => {
    map?.addControl(mobileMode ? navigation.mobile : navigation.desktop);
    map?.addControl(geolocation);

    return () => {
      // QUICK FIX: in hot reload the map is unmounted,
      // so this destructors calls `map` which is alread map.remove()'d
      // getGlobalMap is not a state, so it has instantly a null
      const gmap = getGlobalMap();
      if (gmap) {
        map?.removeControl(mobileMode ? navigation.mobile : navigation.desktop);
        map?.removeControl(geolocation);
      }
    };
  }, [map, mobileMode]);
};
