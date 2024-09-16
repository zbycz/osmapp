import React from 'react';
import { renderOverpass } from './options/overpass';
import { renderPreset } from './options/preset';
import { renderLoader } from './utils';
import { renderStar } from './options/stars';
import { renderGeocoder } from './options/geocoder';
import { Option } from './types';
import { Theme } from '../../helpers/theme';
import { MapCenter } from '../../services/types';

const renderOption = (
  inputValue: string,
  currentTheme: Theme,
  mapCenter: MapCenter,
  option: Option,
) => {
  switch (option.type) {
    case 'overpass':
      return renderOverpass(option);
    case 'star':
      return renderStar(option, mapCenter);
    case 'loader':
      return renderLoader();
    case 'preset':
      return renderPreset(option, inputValue);
    case 'geocoder':
      return renderGeocoder(option, currentTheme, inputValue, mapCenter);
  }
};

export const renderOptionFactory = (
  inputValue: string,
  currentTheme: Theme,
  mapCenter: MapCenter,
) => {
  const Option = ({ key, ...props }, option: Option) => (
    <li key={key} {...props}>
      {renderOption(inputValue, currentTheme, mapCenter, option)}
    </li>
  );
  return Option;
};
