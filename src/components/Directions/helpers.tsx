import { LonLat } from '../../services/types';
import { encodeUrl } from '../../helpers/utils';
import Router from 'next/router';
import { IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import React from 'react';
import { Option } from '../SearchBox/types';
import { getDirectionsCoordsOption } from '../SearchBox/options/coords';
import { getOptionToLonLat } from '../SearchBox/getOptionToLonLat';
import { getOptionLabel } from '../SearchBox/getOptionLabel';

export const splitByFirstTilda = (str: string) => {
  if (!str) {
    return [undefined, undefined];
  }
  const index = str.indexOf('~');
  if (index === -1) {
    return [str, undefined];
  }
  return [str.slice(0, index), str.slice(index + 1)];
};

const getOptionToUrl = (point: Option) => {
  const lonLat = getOptionToLonLat(point);
  return `${lonLat.join(',')}~${getOptionLabel(point)}`;
};

export const buildUrl = (mode: 'car' | 'bike' | 'walk', points: Option[]) => {
  const urlParts = points.map(getOptionToUrl).join('/');
  return encodeUrl`/directions/${mode}/${urlParts}`;
};

const urlCoordsToLonLat = (coords: string) =>
  coords.split(',').map(Number) as LonLat;

export const parseUrlParts = (urlParts: string[]): Option[] =>
  urlParts.map((urlPart) => {
    const [coords, label] = splitByFirstTilda(urlPart);
    return getDirectionsCoordsOption(urlCoordsToLonLat(coords), label);
  });

const close = () => {
  Router.push('/');
};
export const CloseButton = () => (
  <IconButton onClick={close} size="small" aria-label="close">
    <CloseIcon fontSize="small" />
  </IconButton>
);

const getHumanMetric = (meters: number) => {
  if (meters < 1000) {
    return `${Math.round(meters)} m`;
  }
  return `${(meters / 1000).toFixed(1)} km`;
};

const getHumanImperial = (meters: number) => {
  const miles = meters * 0.000621371192;
  if (miles < 1) {
    return `${Math.round(miles * 5280)} ft`;
  }
  return `${miles.toFixed(1)} mi`;
};

export const toHumanDistance = (isImperial: boolean, meters: number) =>
  isImperial ? getHumanImperial(meters) : getHumanMetric(meters);
