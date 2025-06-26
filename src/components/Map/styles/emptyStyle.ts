import { GLYPHS } from '../consts';
import { StyleSpecification } from 'maplibre-gl';

export const emptyStyle = {
  version: 8,
  name: 'OSM Bright',
  sources: {},
  sprite: [],
  glyphs: GLYPHS,
  layers: [],
} as StyleSpecification;
