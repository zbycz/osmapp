import {
  ExpressionInputType,
  ExpressionSpecification,
  LayerSpecification,
} from '@maplibre/maplibre-gl-style-spec';
import { CLIMBING_TILES_SOURCE } from '../consts';

const HOVER: ExpressionSpecification = [
  'case',
  ['boolean', ['feature-state', 'hover'], false],
  1,
  0,
];

const SHOULD_SHOW: ExpressionInputType | ExpressionSpecification =
  global.window?.localStorage.getItem('show_all_climbing_outlines') === 'true'
    ? 1
    : HOVER;

const BY_ZOOM = (z: number): ExpressionSpecification => [
  'case',
  ['>', z, ['get', 'minZoom']],
  SHOULD_SHOW,
  0,
];

const zoomSpec = Array.from({ length: 22 }, (_, z) => [z, BY_ZOOM(z)]).flat();

export const outlinesLayer: LayerSpecification = {
  id: 'climbing outline',
  // metadata: { clickableWithOsmId: true },
  type: 'line',
  source: CLIMBING_TILES_SOURCE,
  filter: ['==', 'type', 'outline'],
  layout: { 'line-cap': 'round' },
  paint: {
    'line-color': '#f60',
    'line-width': 2,
    'line-opacity': ['step', ['zoom'], 0, ...zoomSpec],
  },
};
