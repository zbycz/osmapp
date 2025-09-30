import React, { useEffect } from 'react';
import { Alert, Chip, CircularProgress } from '@mui/material';

import styled from '@emotion/styled';
import { useInitEditFeatureMap } from './useInitEditFeatureMap';
import LayersIcon from '@mui/icons-material/Layers';
import { getMapStyle } from './getMapStyle';
import { useCurrentItem } from '../../../context/EditContext';
import { LocationInputs } from './LocationInputs';
import { t } from '../../../../../../services/intl';

const Container = styled.div`
  height: 500px;
  position: relative;
  overflow: hidden;
  left: -30px;
  width: calc(100% + 60px);
  border-radius: 3px;
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

const StyledAlert = styled(Alert)`
  position: absolute;
  bottom: 8px;
  left: 50%;
  transform: translateX(-50%);
`;
const NoLocationAlert = () => (
  <StyledAlert severity="info">{t('editdialog.no_location_alert')}</StyledAlert>
);

const EditFeatureMap = ({ mapStyle, setMapStyle }) => {
  const { containerRef, isMapLoaded, mapRef } = useInitEditFeatureMap();

  useEffect(() => {
    const style = getMapStyle(mapStyle);
    mapRef.current.setStyle(style);
  }, [mapStyle, mapRef]);

  const { shortId, nodeLonLat } = useCurrentItem();
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
        <Map
          className="edit-feature-map"
          $isVisible={isMapLoaded}
          ref={containerRef}
        />
        <MapStyle>
          <Chip
            component="button"
            label={mapStyle}
            icon={<LayersIcon />}
            onClick={switchMapStyle}
            color="secondary"
          />
        </MapStyle>

        {nodeLonLat === undefined && <NoLocationAlert />}
      </Container>

      <LocationInputs key={shortId} />
    </>
  );
};

export default EditFeatureMap;
