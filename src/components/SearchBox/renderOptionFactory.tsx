import React from 'react';
import { renderOverpass } from './options/overpass';
import { renderPreset } from './options/preset';
import { renderLoader } from './utils';
import { renderStar } from './options/stars';
import { renderGeocoder } from './options/geocoder';
import { LonLat } from '../../services/types';

// TODO refactor to use components, so they can use hooks
const renderOption = (inputValue, currentTheme, mapCenter: LonLat, option) => {
  const { preset, overpass, star, loader } = option;
  if (overpass) {
    return renderOverpass(overpass);
  }

  if (star) {
    return renderStar(star, mapCenter);
  }

  if (loader) {
    return renderLoader();
  }

  if (preset) {
    return renderPreset(preset, inputValue);
  }

  return renderGeocoder(option, currentTheme, inputValue, mapCenter);
};

export const renderOptionFactory = (
  inputValue,
  currentTheme,
  mapCenter: LonLat,
) => {
  const Option = ({ key, ...props }, option) => (
    <li key={key} {...props}>
      {renderOption(inputValue, currentTheme, mapCenter, option)}
    </li>
  );
  return Option;
};
