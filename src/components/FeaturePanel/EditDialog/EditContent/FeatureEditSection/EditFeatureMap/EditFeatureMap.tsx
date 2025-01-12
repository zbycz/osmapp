import React, { useState } from 'react';
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  CircularProgress,
  Typography,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

import styled from '@emotion/styled';
import { t } from '../../../../../../services/intl';
import { useFeatureEditData } from '../SingleFeatureEditContext';
import { useInitEditFeatureMap } from './useInitEditFeatureMap';

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

export default function EditFeatureMap() {
  const { containerRef, isMapLoaded } = useInitEditFeatureMap();
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
}
