import { useEffect } from 'react';
import maplibregl, { Map } from 'maplibre-gl';
import { getGlobalMap } from '../../services/mapStorage';
import { t } from '../../services/intl';
import { useTurnByTurnContext } from '../utils/TurnByTurnContext';
import { isMobileDevice } from '../helpers';

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
const updateCompassFactory =
  (map: Map, mobileMode: boolean, visible: boolean) => () => {
    const bearing = map.getBearing();
    const pitch = map.getPitch();

    const hidden = (mobileMode && bearing === 0 && pitch === 0) || !visible;
    if (hidden) {
      map.getContainer().classList.add('hidden-compass');
      return;
    }

    map.getContainer().classList.remove('hidden-compass');
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

const addControls = (map: Map, mobileMode: boolean, cleanUp: () => void) => {
  const navControl =
    isMobileDevice() || mobileMode ? navigation.mobile : navigation.desktop;

  map.addControl(navControl);
  map.addControl(geolocation);

  return () => {
    // QUICK FIX: in hot reload the map is unmounted,
    // so this destructors calls `map` which is alread map.remove()'d
    // getGlobalMap is not a state, so it has instantly a null
    const gmap = getGlobalMap();
    if (!gmap) {
      return;
    }

    map.removeControl(navControl);
    map.removeControl(geolocation);
    cleanUp();
  };
};

export const useAddTopRightControls = (map: Map, mobileMode: boolean) => {
  const { routingResult } = useTurnByTurnContext();

  useEffect(() => {
    if (!map) {
      return;
    }

    const updateCompass = updateCompassFactory(map, mobileMode, !routingResult);
    map.on('rotateend', updateCompass);
    map.on('pitchend', updateCompass);
    updateCompass();

    const cleanUp = () => {
      map.off('rotateend', updateCompass);
      map.off('pitchend', updateCompass);
    };

    if (routingResult) {
      // leave the controls hidden
      return cleanUp;
    }

    return addControls(map, mobileMode, cleanUp);
  }, [map, mobileMode, routingResult]);
};
