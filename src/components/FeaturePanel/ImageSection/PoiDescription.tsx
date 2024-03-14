import React from 'react';
import styled from 'styled-components';
import { getPoiType } from '../../../helpers/featureLabel';
import { useFeatureContext } from '../../utils/FeatureContext';
import Maki from '../../utils/Maki';
import { useUserThemeContext } from '../../../helpers/theme';

const PoiType = styled.div<{ isSkeleton: Boolean; alwaysWhiteFont: Boolean }>`
  color: ${({ alwaysWhiteFont, theme }) =>
    alwaysWhiteFont ? '#fff' : theme.palette.text.secondary};
  margin: 0 auto 0 15px;
  font-size: 13px;
  position: relative;
  width: 100%;

  svg {
    vertical-align: bottom;
  }

  span {
    position: absolute;
    left: 20px;
    ${({ isSkeleton }) => isSkeleton && 'opacity: 0.4;'}
  }
`;

export const PoiDescriptionDark = () => {
  const { feature } = useFeatureContext();
  const { properties } = feature;
  const poiType = getPoiType(feature);

  return (
    <PoiType isSkeleton={feature.skeleton} alwaysWhiteFont>
      <Maki ico={properties.class} invert middle />
      <span>{poiType}</span>
    </PoiType>
  );
};

export const PoiDescription = () => {
  const { currentTheme } = useUserThemeContext();
  const { feature } = useFeatureContext();
  const { properties } = feature;
  const poiType = getPoiType(feature);

  return (
    <PoiType isSkeleton={feature.skeleton}>
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
