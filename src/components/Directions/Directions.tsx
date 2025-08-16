import { useFeatureContext } from '../utils/FeatureContext';
import { DirectionsProvider } from './DirectionsContext';
import { DirectionsBox } from './DirectionsBox';
import React from 'react';
import styled from '@emotion/styled';
import { t } from '../../services/intl';

const StyledH1 = styled.h1`
  position: absolute;
  left: -9999px;
`;

const SeoTitle = () => (
  <StyledH1>{t('featurepanel.directions_button')}</StyledH1>
);

export const Directions = () => {
  const { featureShown } = useFeatureContext();

  if (featureShown) {
    return null; // skeleton feature can be shown before the URL is finished switching (see ARCHITECTURE.md)
  }

  return (
    <DirectionsProvider>
      <SeoTitle />
      <DirectionsBox />
    </DirectionsProvider>
  );
};
