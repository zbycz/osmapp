import React from 'react';
import { renderOverpass } from './options/overpass';
import { renderPreset } from './options/preset';
import { renderLoader } from './utils';
import { renderStar } from './options/stars';
import { renderGeocoder } from './options/geocoder';
import { Option } from './types';
import { Theme } from '../../helpers/theme';
import { LonLat } from '../../services/types';
import { renderOsm } from './options/openstreetmap';

const renderOption = (
  inputValue: string,
  currentTheme: Theme,
  mapCenter: LonLat,
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
    case 'osm':
      return renderOsm(option);
  }
};

export const renderOptionFactory = (
  inputValue: string,
  currentTheme: Theme,
  mapCenter: LonLat,
) => {
  const Option = ({ key, ...props }, option: Option) => (
    <li key={key} {...props}>
      {renderOption(inputValue, currentTheme, mapCenter, option)}
    </li>
  );
  return Option;
};
