import Router from 'next/router';
import { getCoordsFeature } from '../../../services/getCoordsFeature';
import { getRoundedPosition } from '../../../utils';
import { Feature } from '../../../services/types';
import { getOsmappLink } from '../../../services/helpers';

export const pushFeatureToRouter = (feature: Feature | null) => {
  const link = feature ? getOsmappLink(feature) : '/';
  const url = `${link}${window.location.hash}`;
  Router.push(url, undefined, { locale: 'default' });
};

export const createCoordsFeature = (coords: number[], map) =>
  getCoordsFeature(getRoundedPosition(coords, map.getZoom()));
