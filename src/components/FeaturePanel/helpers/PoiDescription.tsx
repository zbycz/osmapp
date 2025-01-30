import React from 'react';
import styled from '@emotion/styled';
import { getHumanPoiType } from '../../../helpers/featureLabel';
import { useFeatureContext } from '../../utils/FeatureContext';
import Maki from '../../utils/Maki';
import { useUserThemeContext } from '../../../helpers/theme';
import { Typography } from '@mui/material';

const PoiType = styled.div<{ $isSkeleton: Boolean }>`
  position: relative;

  img {
    position: relative;
    top: -1px;
    left: 1px;
  }
`;

export const PoiDescription = () => {
  const { currentTheme } = useUserThemeContext();
  const { feature } = useFeatureContext();
  const { properties } = feature;
  const poiType = getHumanPoiType(feature);

  return (
    <PoiType $isSkeleton={feature.skeleton}>
      <Maki
        ico={properties.class}
        invert={currentTheme === 'dark'}
        middle
        style={{ opacity: '0.3' }}
      />
      <Typography variant="caption" color="secondary">
        {poiType}
      </Typography>
    </PoiType>
  );
};
