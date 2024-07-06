import React from 'react';
import { useFeatureContext } from '../../utils/FeatureContext';
import { FeatureImage } from './FeatureImage';

export const ImageSection = () => {
  const { feature } = useFeatureContext();
  const { properties } = feature;

  return <FeatureImage feature={feature} ico={properties.class} />;
};
