import { LonLat } from '../../services/types';
import * as Sentry from '@sentry/nextjs';
import { encodeUrl } from '../../helpers/utils';
import Router from 'next/router';
import { IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import React from 'react';
import { Option } from '../SearchBox/types';
import { getCoordsOption } from '../SearchBox/options/coords';
import { getOptionToLonLat } from '../SearchBox/getOptionToLonLat';
import { getOptionLabel } from '../SearchBox/getOptionLabel';
import { t } from '../../services/intl';
import { ShowToast } from '../utils/SnackbarContext';
import { PointsTooFarError } from './routing/types';
import { FetchError } from '../../services/helpers';

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
  const urlParts = points.map(getOptionToUrl);
  return encodeUrl`/directions/${mode}/${urlParts.join('/')}`;
};

const urlCoordsToLonLat = (coords: string): LonLat =>
  coords.split(',').map(Number);

export const parseUrlParts = (urlParts: string[]): Option[] =>
  urlParts.map((urlPart) => {
    const [coords, label] = splitByFirstTilda(urlPart);
    return getCoordsOption(urlCoordsToLonLat(coords), label);
  });

const close = () => {
  Router.push('/');
};
export const CloseButton = () => (
  <IconButton onClick={close} size="small" aria-label="close">
    <CloseIcon fontSize="small" />
  </IconButton>
);

export const getAutocompletelabel = (isFirst: boolean, isLast: boolean) => {
  if (isFirst) {
    return t('directions.form.starting_point');
  }
  if (isLast) {
    return t('directions.form.destination');
  }
  return 'middle';
};

export const getOnrejected = (showToast: ShowToast) => {
  return (error: unknown) => {
    if (error instanceof PointsTooFarError) {
      showToast(t('directions.error.too_far'), 'warning');
    } else if (error instanceof FetchError) {
      Sentry.captureException(error);
      showToast(`${t('error')} code ${error.code}`, 'error');
    } else {
      Sentry.captureException(error);
      showToast(`${t('error')} – ${error}`, 'error');
      throw error;
    }
  };
};
