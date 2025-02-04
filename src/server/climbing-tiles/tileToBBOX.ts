import { BBox } from 'geojson';
import { Tile } from '../../types';

const r2d = 180 / Math.PI;

const tile2lon = (x: number, z: number): number =>
  (x / Math.pow(2, z)) * 360 - 180;

const tile2lat = (y: number, z: number): number => {
  const n = Math.PI - (2 * Math.PI * y) / Math.pow(2, z);
  return r2d * Math.atan(0.5 * (Math.exp(n) - Math.exp(-n)));
};

export const tileToBBOX = ({ z, x, y }: Tile): BBox => {
  const e = tile2lon(x + 1, z);
  const w = tile2lon(x, z);
  const s = tile2lat(y + 1, z);
  const n = tile2lat(y, z);
  return [w, s, e, n];
};
