import { useEffect, useCallback, useRef } from 'react';
import { Map } from 'maplibre-gl';
import { useCurrentItem } from '../../../context/EditContext';
import { isGpsValid } from './isGpsValid';
import { LonLat } from '../../../../../../services/types';

export const useUpdateCenter = (mapRef: React.MutableRefObject<Map | null>) => {
  const { nodeLonLat } = useCurrentItem();
  const lastCentered = useRef<LonLat | null>(null);

  const updateCenter = useCallback(() => {
    const center = nodeLonLat;
    if (!center || !isGpsValid(center)) return;

    if (
      !lastCentered.current ||
      lastCentered.current[0] !== center[0] ||
      lastCentered.current[1] !== center[1]
    ) {
      mapRef.current?.easeTo({ center });
      lastCentered.current = center;
    }
  }, [mapRef, nodeLonLat]);

  useEffect(() => {
    if (!mapRef.current) return;

    const map = mapRef.current;
    map.on('load', updateCenter);

    return () => {
      map.off('load', updateCenter);
    };
  }, [mapRef, updateCenter]);

  useEffect(updateCenter, [updateCenter]);
};
