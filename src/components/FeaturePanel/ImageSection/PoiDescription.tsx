import React from 'react';
import styled from 'styled-components';
import { getHumanPoiType } from '../../../helpers/featureLabel';
import { useFeatureContext } from '../../utils/FeatureContext';
import Maki from '../../utils/Maki';
import { useUserThemeContext } from '../../../helpers/theme';

const PoiType = styled.div<{ $isSkeleton: Boolean; $forceWhite?: Boolean }>`
  color: ${({ $forceWhite, theme }) =>
    $forceWhite ? '#fff' : theme.palette.secondary.main};
  margin: 0 auto 0 15px;
  font-size: 13px;
  position: relative;
  ${({ $forceWhite }) => $forceWhite && 'flex: 1;'}

  svg {
    vertical-align: bottom;
  }

  span {
    ${({ $isSkeleton }) => $isSkeleton && 'opacity: 0.4;'}
  }
`;

export const PoiDescriptionDark = () => {
  const { feature } = useFeatureContext();
  const { properties } = feature;
  const poiType = getHumanPoiType(feature);

  return (
    <PoiType $isSkeleton={feature.skeleton} $forceWhite>
      <Maki ico={properties.class} invert middle />
      <span>{poiType}</span>
    </PoiType>
  );
};

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
