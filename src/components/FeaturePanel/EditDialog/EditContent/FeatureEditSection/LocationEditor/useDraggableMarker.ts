import React, { useRef } from 'react';
import maplibregl, { LngLat } from 'maplibre-gl';
import { createMapEffectHook } from '../../../../../helpers';
import { LonLat } from '../../../../../../services/types';
import { isGpsValid } from './isGpsValid';

const useUpdateDraggableFeatureMarker = createMapEffectHook<
  [
    {
      onMarkerChange: (lngLat: LngLat) => void;
      nodeLonLat: LonLat;
      markerRef: React.MutableRefObject<maplibregl.Marker>;
    },
  ]
>((map, props) => {
  const { markerRef, nodeLonLat, onMarkerChange } = props;

  const onDragEnd = () => {
    const lngLat = markerRef.current?.getLngLat();
    if (lngLat) {
      onMarkerChange(lngLat);
    }
  };

  markerRef.current?.remove();
  markerRef.current = undefined;

  if (nodeLonLat && isGpsValid(nodeLonLat)) {
    const [lng, lat] = nodeLonLat;

    markerRef.current = new maplibregl.Marker({
      color: 'salmon',
      draggable: true,
    })
      .setLngLat({
        lng: parseFloat(lng.toFixed(6)),
        lat: parseFloat(lat.toFixed(6)),
      })
      .addTo(map);

    markerRef.current?.on('dragend', onDragEnd);
  }
});

export function useDraggableFeatureMarker(
  mapRef: React.MutableRefObject<maplibregl.Map>,
  currentItem: any,
) {
  const markerRef = useRef<maplibregl.Marker>();

  const onMarkerChange = ({ lng, lat }: LngLat) => {
    const newLonLat = [lng, lat];
    currentItem.setNodeLonLat(newLonLat);
  };

  useUpdateDraggableFeatureMarker(mapRef.current, {
    onMarkerChange,
    nodeLonLat: currentItem?.nodeLonLat,
    markerRef,
  });
  return { onMarkerChange };
}
