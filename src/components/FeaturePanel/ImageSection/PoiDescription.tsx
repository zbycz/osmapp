import React from 'react';
import styled from 'styled-components';
import { getHumanPoiType } from '../../../helpers/featureLabel';
import { useFeatureContext } from '../../utils/FeatureContext';
import Maki from '../../utils/Maki';
import { useUserThemeContext } from '../../../helpers/theme';

const PoiType = styled.div<{ $isSkeleton: Boolean }>`
  color: ${({ theme }) => theme.palette.secondary.main};

  font-size: 13px;
  position: relative;

  img {
    position: relative;
    top: -1px;
    left: 1px;
  }

  span {
    ${({ $isSkeleton }) => $isSkeleton && 'opacity: 0.4;'}
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
        style={{ opacity: '0.4' }}
      />
      <span>{poiType}</span>
    </PoiType>
  );
};
