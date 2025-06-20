import { GLYPHS } from '../consts';
import { StyleSpecification } from 'maplibre-gl';

export const emptyStyle = {
  version: 8,
  id: 'empty',
  name: 'Empty style',
  sources: {},
  sprite: [],
  glyphs: GLYPHS,
  layers: [],
} as StyleSpecification;
