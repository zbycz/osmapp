import React from 'react';
import { renderOverpass } from './options/overpass';
import { renderPreset } from './options/preset';
import { renderLoader } from './utils';
import { renderStar } from './options/stars';
import { renderGeocoder } from './options/geocoder';

const renderOption = (inputValue, currentTheme, option) => {
  const { preset, overpass, star, loader } = option;
  if (overpass) {
    return renderOverpass(overpass);
  }

  if (star) {
    return renderStar(star);
  }

  if (loader) {
    return renderLoader();
  }

  if (preset) {
    return renderPreset(preset, inputValue);
  }

  return renderGeocoder(option, currentTheme, inputValue);
};

export const renderOptionFactory =
  (inputValue, currentTheme) => (props, option) =>
    (
      // eslint-disable-next-line react/jsx-props-no-spreading
      <li {...props}>{renderOption(inputValue, currentTheme, option)}</li>
    );
