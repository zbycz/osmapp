import React, { useState, useEffect, useCallback, useRef } from 'react';
import maplibregl from 'maplibre-gl';
import { outdoorStyle } from '../../../../../Map/styles/outdoorStyle';
import { COMPASS_TOOLTIP } from '../../../../../Map/useAddTopRightControls';
import { useCurrentItem, useEditContext } from '../../../EditContext';
import { useFeatureMarkers } from './useStaticMarkers';
import { useDraggableFeatureMarker } from './useDraggableMarker';
import { isGpsValid } from './isGpsValid';
import { Setter } from '../../../../../../types';

const GEOLOCATION_CONTROL = new maplibregl.GeolocateControl({
  positionOptions: { enableHighAccuracy: true },
  fitBoundsOptions: { duration: 4000 },
  trackUserLocation: true,
});

const useUpdateCenter = (
  isFirstMapLoad: boolean,
  mapRef: React.MutableRefObject<maplibregl.Map>,
  setIsFirstMapLoad: Setter<boolean>,
) => {
  const currentItem = useCurrentItem();

  const updateCenter = useCallback(() => {
    if (
      isFirstMapLoad &&
      currentItem?.nodeLonLat &&
      isGpsValid(currentItem?.nodeLonLat)
    ) {
      mapRef.current?.jumpTo({
        center: currentItem.nodeLonLat as [number, number],
        zoom: 18.5,
      });
      setIsFirstMapLoad(false);
    }
  }, [currentItem.nodeLonLat, isFirstMapLoad, mapRef, setIsFirstMapLoad]);

  useEffect(() => {
    mapRef.current?.on('load', updateCenter);
  }, [mapRef, updateCenter]);

  useEffect(updateCenter, [updateCenter]);
};

export function useInitEditFeatureMap(
  isFirstMapLoad: boolean,
  setIsFirstMapLoad: Setter<boolean>,
) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<maplibregl.Map>(null);
  const [isMapLoaded, setIsMapLoaded] = useState(false);
  const { current } = useEditContext();
  const currentItem = useCurrentItem();
  const { onMarkerChange } = useDraggableFeatureMarker(mapRef);
  useFeatureMarkers(mapRef);

  useEffect(() => {
    setIsMapLoaded(false);
    if (!containerRef.current) return undefined;

    const map = new maplibregl.Map({
      container: containerRef.current,
      style: outdoorStyle,
      attributionControl: false,
      refreshExpiredTiles: false,
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

  useUpdateCenter(isFirstMapLoad, mapRef, setIsFirstMapLoad);

  useEffect(() => {
    setIsFirstMapLoad(true);
  }, [current, setIsFirstMapLoad]);

  return { containerRef, isMapLoaded, currentItem, onMarkerChange, mapRef };
}
