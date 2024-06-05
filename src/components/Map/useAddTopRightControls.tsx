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
    if (map) {
      const navControl = mobileMode ? navigation.mobile : navigation.desktop;

      map.getContainer().classList.add('hidden-compass');

      map.addControl(navControl);
      map.addControl(geolocation);

      const updateCompassVisibility = () => {
        const bearing = map.getBearing();
        const compass: HTMLElement = document.querySelector(
          '.maplibregl-ctrl-compass',
        );
        if (Math.abs(bearing) > 0.1) {
          map.getContainer().classList.remove('hidden-compass');
          compass.style.display = 'block';
        } else {
          compass.style.display = 'none';
        }
      };

      map.on('rotate', updateCompassVisibility);
      map.on('load', updateCompassVisibility);

      return () => {
        // QUICK FIX: in hot reload the map is unmounted,
        // so this destructors calls `map` which is alread map.remove()'d
        // getGlobalMap is not a state, so it has instantly a null
        const gmap = getGlobalMap();
        if (gmap) {
          map.removeControl(navControl);
          map.removeControl(geolocation);
          map.off('rotate', updateCompassVisibility);
          map.off('load', updateCompassVisibility);
        }
      };
    }
    return () => null;
  }, [map, mobileMode]);
};
