import React, { useState, useEffect, useCallback } from 'react';
import maplibregl from 'maplibre-gl';
import { outdoorStyle } from '../../../../../Map/styles/outdoorStyle';
import { COMPASS_TOOLTIP } from '../../../../../Map/useAddTopRightControls';
import { useCurrentItem, useEditContext } from '../../../EditContext';
import { useFeatureMarkers } from './useStaticMarkers';
import { useDraggableFeatureMarker } from './useDraggableMarker';
import { isGpsValid } from './isGpsValid';

export function useInitEditFeatureMap(isFirstMapLoad, setIsFirstMapLoad) {
  const containerRef = React.useRef<HTMLDivElement>(null);
  const mapRef = React.useRef<maplibregl.Map>(null);

  const [isMapLoaded, setIsMapLoaded] = useState(false);

  const { current, items, setCurrent } = useEditContext();
  const currentItem = useCurrentItem();

  useFeatureMarkers(mapRef, items, setCurrent, current);

  const { onMarkerChange } = useDraggableFeatureMarker(mapRef, currentItem);

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

    const geolocation = new maplibregl.GeolocateControl({
      positionOptions: { enableHighAccuracy: true },
      fitBoundsOptions: { duration: 4000 },
      trackUserLocation: true,
    });
    map.addControl(geolocation);

    mapRef.current = map;

    mapRef.current.on('load', () => {
      setIsMapLoaded(true);
    });

    return () => {
      if (map) {
        map.remove();
      }
    };
  }, [containerRef, current]);

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
  }, [currentItem.nodeLonLat, isFirstMapLoad, setIsFirstMapLoad]);

  useEffect(() => {
    mapRef.current?.on('load', () => {
      updateCenter();
    });
  }, [updateCenter]);

  useEffect(() => {
    updateCenter();
  }, [current, updateCenter]);

  useEffect(() => {
    setIsFirstMapLoad(true);
  }, [current, setIsFirstMapLoad]);

  useEffect(() => {
    setIsFirstMapLoad(true);
  }, [current, setIsFirstMapLoad]);

  return { containerRef, isMapLoaded, currentItem, onMarkerChange, mapRef };
}
