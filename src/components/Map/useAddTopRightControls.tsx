import { useEffect } from 'react';
import maplibregl from 'maplibre-gl';

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
      map?.removeControl(mobileMode ? navigation.mobile : navigation.desktop);
      map?.removeControl(geolocation);
    };
  }, [map, mobileMode]);
};
