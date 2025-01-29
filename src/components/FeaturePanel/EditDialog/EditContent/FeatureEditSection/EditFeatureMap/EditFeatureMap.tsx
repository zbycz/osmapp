import React, { useState } from 'react';
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  CircularProgress,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

import styled from '@emotion/styled';
import { t } from '../../../../../../services/intl';
import { useFeatureEditData } from '../SingleFeatureEditContext';
import { useInitEditFeatureMap } from './useInitEditFeatureMap';
import { LngLat } from 'maplibre-gl';

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

export default function EditFeatureMap() {
  const [isFirstMapLoad, setIsFirstMapLoad] = useState(true);
  const { containerRef, isMapLoaded, currentItem, onMarkerChange } =
    useInitEditFeatureMap(isFirstMapLoad, setIsFirstMapLoad);
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
      </AccordionDetails>
    </Accordion>
  );
}
