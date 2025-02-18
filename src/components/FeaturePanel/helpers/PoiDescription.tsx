import React from 'react';
import styled from '@emotion/styled';
import { getHumanPoiType } from '../../../helpers/featureLabel';
import { useFeatureContext } from '../../utils/FeatureContext';
import { Typography } from '@mui/material';
import { PoiIcon } from '../../utils/PoiIcon';

const PoiType = styled.div<{ $isSkeleton: Boolean }>`
  position: relative;

  img {
    position: relative;
    top: -1px;
    left: 1px;
  }
  svg {
    position: relative;
    top: 1px;
  }
`;

export const PoiDescription = () => {
  const { feature } = useFeatureContext();
  const poiType = getHumanPoiType(feature);

  return (
    <PoiType $isSkeleton={feature.skeleton}>
      <PoiIcon tags={feature.tags} ico={feature.properties.class} middle />

      <Typography variant="caption" color="secondary" textTransform="lowercase">
        {poiType}
      </Typography>
    </PoiType>
  );
};
