import { useState, useEffect, useRef } from 'react';
import maplibregl from 'maplibre-gl';
import { outdoorStyle } from '../../../../../Map/styles/outdoorStyle';
import { COMPASS_TOOLTIP } from '../../../../../Map/useAddTopRightControls';
import { useCurrentItem, useEditContext } from '../../../context/EditContext';
import { useFeatureMarkers } from './useStaticMarkers';
import { useDraggableFeatureMarker } from './useDraggableMarker';
import { getGlobalMap } from '../../../../../../services/mapStorage';
import { usePersistedScaleControl } from '../../../../../Map/behaviour/PersistedScaleControl';
import { useUpdateCenter } from './useUpdateCenter';

const GEOLOCATION_CONTROL = new maplibregl.GeolocateControl({
  positionOptions: { enableHighAccuracy: true },
  fitBoundsOptions: { duration: 4000 },
  trackUserLocation: true,
});

const getMapCenter = () => getGlobalMap().getCenter().toArray();

export function useInitEditFeatureMap() {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<maplibregl.Map | null>(null);
  const [isMapLoaded, setIsMapLoaded] = useState(false);

  const { current } = useEditContext();
  const currentItem = useCurrentItem();

  useFeatureMarkers(mapRef);
  const { onMarkerChange } = useDraggableFeatureMarker(mapRef);

  useEffect(() => {
    if (!containerRef.current) return;

    setIsMapLoaded(false);

    const map = new maplibregl.Map({
      container: containerRef.current,
      style: outdoorStyle,
      attributionControl: false,
      refreshExpiredTiles: false,
      zoom: 18,
      center: getMapCenter(),
      locale: {
        'NavigationControl.ResetBearing': COMPASS_TOOLTIP,
      },
    });

    map.scrollZoom.setWheelZoomRate(1 / 200);
    map.addControl(GEOLOCATION_CONTROL);

    mapRef.current = map;

    const handleLoad = () => setIsMapLoaded(true);
    map.on('load', handleLoad);

    return () => {
      map.off('load', handleLoad);
      map.remove();
      mapRef.current = null;
    };
  }, [containerRef, current]);

  useUpdateCenter(mapRef);

  usePersistedScaleControl(mapRef, isMapLoaded);

  return {
    containerRef,
    isMapLoaded,
    currentItem,
    onMarkerChange,
    mapRef,
  };
}
