import React, { useState, useEffect, useRef, useCallback } from 'react';
import maplibregl from 'maplibre-gl';
import { outdoorStyle } from '../../../../../Map/styles/outdoorStyle';
import { COMPASS_TOOLTIP } from '../../../../../Map/useAddTopRightControls';

import { useEditContext } from '../../../EditContext';
import { useFeatureMarkers } from './useStaticMarkers';
import { useDraggableFeatureMarker } from './useDraggableMarker';

export function useInitEditFeatureMap() {
  const containerRef = React.useRef<HTMLDivElement>(null);
  const mapRef = React.useRef<maplibregl.Map>(null);

  const [isMapLoaded, setIsMapLoaded] = useState(false);
  const [isFirstMapLoad, setIsFirstMapLoad] = useState(true);

  const { current, items, setCurrent } = useEditContext();
  const currentItem = items.find((item) => item.shortId === current);

  useFeatureMarkers(mapRef, items, setCurrent, current);

  useDraggableFeatureMarker(mapRef, currentItem);

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
    if (isFirstMapLoad && currentItem?.nodeLonLat) {
      mapRef.current?.jumpTo({
        center: currentItem.nodeLonLat as [number, number],
        zoom: 18.5,
      });
      setIsFirstMapLoad(false);
    }
  }, [currentItem?.nodeLonLat, isFirstMapLoad]);

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
  }, [current]);

  return { containerRef, isMapLoaded };
}
