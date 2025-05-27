import { ExpressionSpecification } from '@maplibre/maplibre-gl-style-spec';
import type { DataDrivenPropertyValueSpecification } from 'maplibre-gl';
import { AREA, CRAG } from '../consts';

export const linear = (
  from: number,
  a: number | ExpressionSpecification,
  mid: number,
  b: number | ExpressionSpecification,
  to?: number,
  c?: number | ExpressionSpecification,
): ExpressionSpecification => [
  'interpolate',
  ['linear'],
  ['zoom'],
  from,
  a,
  mid,
  b,
  ...(to && c ? [to, c] : []),
];

export const sortKey = [
  '*',
  -1,
  [
    '+',
    ['to-number', ['get', 'osmappRouteCount']],
    ['case', ['get', 'osmappHasImages'], 10000, 0], // preference for items with images
    ['case', ['to-boolean', ['get', 'name']], 2, 0], // prefer items with name
  ],
] as DataDrivenPropertyValueSpecification<number>;

export const linearByRouteCount = (
  from: number,
  a: number | ExpressionSpecification,
  to: number,
  b: number | ExpressionSpecification,
): ExpressionSpecification => [
  'interpolate',
  ['linear'],
  ['coalesce', ['get', 'osmappRouteCount'], 0],
  from,
  a,
  to,
  b,
];

const ifHasImages = (
  value: string,
  elseValue: string,
): ExpressionSpecification => [
  'case',
  ['get', 'osmappHasImages'],
  value,
  elseValue,
];

export const byHasImages = (
  spec: typeof AREA | typeof CRAG,
  property: 'IMAGE' | 'COLOR',
): ExpressionSpecification =>
  ifHasImages(spec.HAS_IMAGES[property], spec.NO_IMAGES[property]);

export const ifCrag = (
  crag: ExpressionSpecification | number,
  elseValue: ExpressionSpecification | number,
): ExpressionSpecification => [
  'case',
  ['==', ['get', 'climbing'], 'crag'],
  crag,
  elseValue,
];

export const hover = (
  basic: number,
  hovered: number,
): ExpressionSpecification => [
  'case',
  ['boolean', ['feature-state', 'hover'], false],
  hovered,
  basic,
];
