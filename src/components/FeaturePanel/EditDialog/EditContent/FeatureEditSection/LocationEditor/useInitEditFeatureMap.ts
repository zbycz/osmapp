import React, { useState, useEffect, useCallback, useRef } from 'react';
import maplibregl from 'maplibre-gl';
import { outdoorStyle } from '../../../../../Map/styles/outdoorStyle';
import { COMPASS_TOOLTIP } from '../../../../../Map/useAddTopRightControls';
import { useCurrentItem, useEditContext } from '../../../context/EditContext';
import { useFeatureMarkers } from './useStaticMarkers';
import { useDraggableFeatureMarker } from './useDraggableMarker';
import { isGpsValid } from './isGpsValid';
import { LonLat } from '../../../../../../services/types';
import { getGlobalMap } from '../../../../../../services/mapStorage';

const GEOLOCATION_CONTROL = new maplibregl.GeolocateControl({
  positionOptions: { enableHighAccuracy: true },
  fitBoundsOptions: { duration: 4000 },
  trackUserLocation: true,
});

const useUpdateCenter = (mapRef: React.MutableRefObject<maplibregl.Map>) => {
  const { nodeLonLat } = useCurrentItem();
  const updatedHere = useRef<LonLat>();

  const updateCenter = useCallback(() => {
    const center = nodeLonLat as [number, number];
    if (center && updatedHere.current !== center && isGpsValid(center)) {
      mapRef.current?.easeTo({ center });
      updatedHere.current = center;
    }
  }, [mapRef, nodeLonLat]);

  useEffect(() => {
    mapRef.current?.on('load', updateCenter);
  }, [mapRef, updateCenter]);

  useEffect(updateCenter, [updateCenter]);
};

const getMapCenter = (): LonLat => getGlobalMap().getCenter().toArray();

export function useInitEditFeatureMap() {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<maplibregl.Map>(null);
  const [isMapLoaded, setIsMapLoaded] = useState(false);
  const { current } = useEditContext();
  const currentItem = useCurrentItem();
  useFeatureMarkers(mapRef);
  const { onMarkerChange } = useDraggableFeatureMarker(mapRef);

  useEffect(() => {
    setIsMapLoaded(false);
    if (!containerRef.current) return undefined;

    const map = new maplibregl.Map({
      container: containerRef.current,
      style: outdoorStyle,
      attributionControl: false,
      refreshExpiredTiles: false,
      zoom: 18,
      center: getMapCenter() as [number, number],
      locale: {
        'NavigationControl.ResetBearing': COMPASS_TOOLTIP,
      },
    });

    map.scrollZoom.setWheelZoomRate(1 / 200);
    map.addControl(GEOLOCATION_CONTROL);

    mapRef.current = map;
    mapRef.current.on('load', () => {
      setIsMapLoaded(true);
    });

    return () => {
      map?.remove();
    };
  }, [containerRef, current]);

  useUpdateCenter(mapRef);

  return { containerRef, isMapLoaded, currentItem, onMarkerChange, mapRef };
}
