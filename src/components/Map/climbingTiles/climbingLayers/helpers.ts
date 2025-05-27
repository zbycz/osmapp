import { ExpressionSpecification } from '@maplibre/maplibre-gl-style-spec';
import type { DataDrivenPropertyValueSpecification } from 'maplibre-gl';

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
