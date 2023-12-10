import { OSMAPP_SOURCES } from '../consts';
import { basicStyle } from './basicStyle';
import { View } from '../../utils/MapStateContext';

const sources = JSON.parse(JSON.stringify(OSMAPP_SOURCES));

sources.maptiler_planet.url =
  'https://africa.tiles.openplaceguide.org/data/v3.json';

export const makinaAfricaStyle = { ...basicStyle, sources };

const africaBbox = [
  -20, // west
  -35, // south
  55, // east
  40, // north
];

export const isViewInsideAfrica = ([, lat, lon]: View) =>
  parseFloat(lat) > africaBbox[1] &&
  parseFloat(lat) < africaBbox[3] &&
  parseFloat(lon) > africaBbox[0] &&
  parseFloat(lon) < africaBbox[2];
