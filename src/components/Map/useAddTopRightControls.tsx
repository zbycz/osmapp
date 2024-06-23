import { useEffect } from 'react';
import maplibregl from 'maplibre-gl';
import { getGlobalMap } from '../../services/mapStorage';
import { t } from '../../services/intl';

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

// TODO create custom NavigationControl and move it there (see OsmappTerrainControl)
export const COMPASS_TOOLTIP = t('map.compass_tooltip');
const updateCompassFactory = (map: any, mobileMode: boolean) => () => {
  const bearing = map.getBearing();
  const pitch = map.getPitch();

  if (mobileMode && bearing === 0 && pitch === 0) {
    map.getContainer().classList.add('hidden-compass');
  } else {
    map.getContainer().classList.remove('hidden-compass');
  }
};

const geolocation = new maplibregl.GeolocateControl({
  positionOptions: {
    enableHighAccuracy: true,
  },
  fitBoundsOptions: {
    duration: 4000,
  },
  trackUserLocation: true,
});

export const useAddTopRightControls = (map: any, mobileMode: boolean) => {
  useEffect(() => {
    if (map) {
      const navControl = mobileMode ? navigation.mobile : navigation.desktop;

      map.addControl(navControl);
      map.addControl(geolocation);

      const updateCompass = updateCompassFactory(map, mobileMode);
      map.on('rotateend', updateCompass);
      map.on('pitchend', updateCompass);
      updateCompass();

      return () => {
        // QUICK FIX: in hot reload the map is unmounted,
        // so this destructors calls `map` which is alread map.remove()'d
        // getGlobalMap is not a state, so it has instantly a null
        const gmap = getGlobalMap();
        if (gmap) {
          map.removeControl(navControl);
          map.removeControl(geolocation);
          map.off('rotateend', updateCompass);
          map.off('pitchend', updateCompass);
        }
      };
    }
    return () => null;
  }, [map, mobileMode]);
};
