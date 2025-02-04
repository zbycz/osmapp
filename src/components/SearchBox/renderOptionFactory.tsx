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
import { renderCoords } from './options/coords';

const renderOption = (
  inputValue: string,
  currentTheme: Theme,
  mapCenter: LonLat,
  option: Option,
  isImperial: boolean,
) => {
  switch (option.type) {
    case 'overpass':
      return renderOverpass(option);
    case 'star':
      return renderStar(option, inputValue, mapCenter, isImperial);
    case 'loader':
      return renderLoader();
    case 'preset':
      return renderPreset(option, inputValue);
    case 'geocoder':
      return renderGeocoder(
        option,
        currentTheme,
        inputValue,
        mapCenter,
        isImperial,
      );
    case 'osm':
      return renderOsm(option);
    case 'coords':
      return renderCoords(option);
  }
};

export const renderOptionFactory = (
  inputValue: string,
  currentTheme: Theme,
  mapCenter: LonLat,
  isImperial: boolean,
) => {
  const Option = ({ key, ...props }, option: Option) => (
    <li key={key} {...props}>
      {renderOption(inputValue, currentTheme, mapCenter, option, isImperial)}
    </li>
  );
  return Option;
};
