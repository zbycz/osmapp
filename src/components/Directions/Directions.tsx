import { useFeatureContext } from '../utils/FeatureContext';
import { DirectionsProvider } from './DirectionsContext';
import { DirectionsBox } from './DirectionsBox';
import React from 'react';

export const Directions = () => {
  const { featureShown } = useFeatureContext();

  if (featureShown) {
    return null; // skeleton feature can be shown before the URL is finished switching (see ARCHITECTURE.md)
  }

  return (
    <DirectionsProvider>
      <DirectionsBox />
    </DirectionsProvider>
  );
};
