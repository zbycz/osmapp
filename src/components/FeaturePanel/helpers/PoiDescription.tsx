import React from 'react';
import styled from '@emotion/styled';
import { getHumanPoiType } from '../../../helpers/featureLabel';
import { useFeatureContext } from '../../utils/FeatureContext';
import { Typography } from '@mui/material';
import { PoiIcon } from '../../utils/icons/PoiIcon';

const PoiType = styled.div<{ $isSkeleton: Boolean }>`
  position: relative;
  display: flex;

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
      <PoiIcon
        tags={feature.tags}
        ico={
          feature.skeleton || feature.point
            ? feature.properties.class
            : undefined
        }
        middle
      />
      <Typography
        variant="caption"
        color="secondary"
        textTransform="lowercase"
        component="h2"
      >
        {poiType}
      </Typography>
    </PoiType>
  );
};
