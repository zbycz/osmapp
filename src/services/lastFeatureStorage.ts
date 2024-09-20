import { Feature } from './types';

let lastFeature: Feature = null;

export const getLastFeature = (): Feature => lastFeature;

export const setLastFeature = (feature: Feature) => {
  lastFeature = feature;
};
