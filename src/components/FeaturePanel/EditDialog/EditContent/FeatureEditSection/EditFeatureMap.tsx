import React, { useCallback, useEffect, useRef, useState } from 'react';
import maplibregl, { LngLat } from 'maplibre-gl';
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  CircularProgress,
  Typography,
} from '@mui/material';
import styled from '@emotion/styled';
import { outdoorStyle } from '../../../../Map/styles/outdoorStyle';
import { COMPASS_TOOLTIP } from '../../../../Map/useAddTopRightControls';
import { createMapEffectHook } from '../../../../helpers';
import { LonLat } from '../../../../../services/types';
import { useFeatureEditData } from './SingleFeatureEditContext';
import { useEditContext } from '../../EditContext';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { t } from '../../../../../services/intl';

const Container = styled.div`
  width: 100%;
  height: 500px;
  position: relative;
`;

const LoadingContainer = styled.div`
  height: 100%;
  width: 100%;
  position: absolute;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const Map = styled.div<{ $isVisible: boolean }>`
  visibility: ${({ $isVisible }) => ($isVisible ? 'visible' : 'hidden')};
  height: 100%;
  width: 100%;
`;

const useUpdateFeatureMarker = createMapEffectHook<
  [
    {
      onMarkerChange: (lngLat: LngLat) => void;
      nodeLonLat: LonLat;
      markerRef: React.MutableRefObject<maplibregl.Marker>;
    },
  ]
>((map, props) => {
  const onDragEnd = () => {
    const lngLat = markerRef.current?.getLngLat();
    if (lngLat) {
      props.onMarkerChange(lngLat);
    }
  };

  const { markerRef, nodeLonLat } = props;

  markerRef.current?.remove();
  markerRef.current = undefined;

  if (nodeLonLat) {
    const [lng, lat] = nodeLonLat;
    markerRef.current = new maplibregl.Marker({
      color: '#556cd6',
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

const useInitMap = () => {
  const containerRef = React.useRef(null);
  const mapRef = React.useRef<maplibregl.Map>(null);
  const [isMapLoaded, setIsMapLoaded] = useState(false);
  const [isFirstMapLoad, setIsFirstMapLoad] = useState(true);

  const { current, items } = useEditContext();
  const currentItem = items.find((item) => item.shortId === current);
  const markerRef = useRef<maplibregl.Marker>();

  const onMarkerChange = ({ lng, lat }: LngLat) => {
    const newLonLat = [lng, lat];

    currentItem.setNodeLonLat(newLonLat);
  };

  useUpdateFeatureMarker(mapRef.current, {
    onMarkerChange,
    nodeLonLat: currentItem.nodeLonLat,
    markerRef,
  });

  React.useEffect(() => {
    const geolocation = new maplibregl.GeolocateControl({
      positionOptions: {
        enableHighAccuracy: true,
      },
      fitBoundsOptions: {
        duration: 4000,
      },
      trackUserLocation: true,
    });

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

    map.scrollZoom.setWheelZoomRate(1 / 200); // 1/450 is default, bigger value = faster
    map.addControl(geolocation);
    mapRef.current = map;

    mapRef.current?.on('load', () => {
      setIsMapLoaded(true);
    });

    return () => {
      if (map) {
        map.remove();
      }
    };
  }, [containerRef, current]);

  const updateCenter = useCallback(() => {
    if (isFirstMapLoad) {
      mapRef.current?.jumpTo({
        center: currentItem.nodeLonLat as [number, number],
        zoom: 18.5,
      });
      setIsFirstMapLoad(false);
    }
  }, [currentItem.nodeLonLat, isFirstMapLoad]);

  useEffect(() => {
    mapRef.current?.on('load', () => {
      updateCenter();
    });
  }, [currentItem.nodeLonLat, isFirstMapLoad, updateCenter]);

  useEffect(() => {
    updateCenter();
  }, [current, updateCenter]);

  // edit data item switched
  useEffect(() => {
    setIsFirstMapLoad(true);
  }, [current]);

  return { containerRef, isMapLoaded };
};

const EditFeatureMap = () => {
  const { containerRef, isMapLoaded } = useInitMap();
  const [expanded, setExpanded] = useState(false);

  const { shortId } = useFeatureEditData();
  const isNode = shortId[0] === 'n';

  if (!isNode) return null;

  return (
    <Accordion
      disableGutters
      elevation={0}
      square
      expanded={expanded}
      onChange={() => setExpanded(!expanded)}
    >
      <AccordionSummary expandIcon={<ExpandMoreIcon />}>
        <Typography variant="button">{t('editdialog.location')}</Typography>
      </AccordionSummary>
      <AccordionDetails>
        <Container>
          {!isMapLoaded && (
            <LoadingContainer>
              <CircularProgress color="primary" />
            </LoadingContainer>
          )}
          <Map $isVisible={isMapLoaded} ref={containerRef} />
        </Container>
      </AccordionDetails>
    </Accordion>
  );
};
export default EditFeatureMap; // dynamic import
