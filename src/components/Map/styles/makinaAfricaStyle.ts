import { OSMAPP_SOURCES } from '../consts';
import { basicStyle } from './basicStyle';

const sources = JSON.parse(JSON.stringify(OSMAPP_SOURCES));

sources.maptiler_planet.url =
  'https://africa.tiles.openplaceguide.org/data/v3.json';

export const makinaAfricaStyle = { ...basicStyle, sources };
