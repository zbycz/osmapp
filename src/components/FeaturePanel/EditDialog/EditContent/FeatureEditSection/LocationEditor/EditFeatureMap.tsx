import React, { useEffect, useState } from 'react';
import { Chip, CircularProgress, Stack, TextField } from '@mui/material';

import styled from '@emotion/styled';
import { t } from '../../../../../../services/intl';
import { useInitEditFeatureMap } from './useInitEditFeatureMap';
import { LngLat } from 'maplibre-gl';
import LayersIcon from '@mui/icons-material/Layers';
import { getMapStyle } from './getMapStyle';
import { useCurrentItem } from '../../../EditContext';

const Container = styled.div`
  width: 100%;
  height: 500px;
  position: relative;
  overflow: hidden;
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
const MapStyle = styled.div`
  position: absolute;
  top: 4px;
  right: 4px;
`;

const EditFeatureMap = ({ mapStyle, setMapStyle }) => {
  const [isFirstMapLoad, setIsFirstMapLoad] = useState(true);
  const { containerRef, isMapLoaded, currentItem, onMarkerChange, mapRef } =
    useInitEditFeatureMap(isFirstMapLoad, setIsFirstMapLoad);

  useEffect(() => {
    const style = getMapStyle(mapStyle);
    mapRef.current.setStyle(style);
  }, [mapStyle, mapRef]);

  const { shortId } = useCurrentItem();
  const isNode = shortId[0] === 'n';
  if (!isNode) return null;

  const switchMapStyle = () => {
    if (mapStyle === 'outdoor') {
      setMapStyle('satellite');
    } else {
      setMapStyle('outdoor');
    }
  };

  return (
    <>
      <Container>
        {!isMapLoaded && (
          <LoadingContainer>
            <CircularProgress color="primary" />
          </LoadingContainer>
        )}
        <Map $isVisible={isMapLoaded} ref={containerRef} />
        <MapStyle>
          <Chip
            component="button"
            label={mapStyle}
            icon={<LayersIcon />}
            onClick={switchMapStyle}
            color="secondary"
          />
        </MapStyle>
      </Container>

      <Stack direction="row" mt={2} gap={1}>
        <TextField
          label={t('editdialog.location_latitude')}
          variant="outlined"
          value={currentItem?.nodeLonLat[1] || ''}
          onChange={(e) => {
            onMarkerChange({
              lng: currentItem?.nodeLonLat[0],
              lat: parseFloat(e.target.value),
            } as LngLat);
            setIsFirstMapLoad(true);
          }}
          size="small"
        />
        <TextField
          label={t('editdialog.location_longitude')}
          variant="outlined"
          value={currentItem?.nodeLonLat[0] || ''}
          onChange={(e) => {
            onMarkerChange({
              lng: parseFloat(e.target.value),
              lat: currentItem?.nodeLonLat[1],
            } as LngLat);
            setIsFirstMapLoad(true);
          }}
          size="small"
        />
      </Stack>
    </>
  );
};

export default EditFeatureMap;
