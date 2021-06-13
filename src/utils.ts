import { LonLatRounded, Position } from './services/types';

// Accuracy = 1m, see https://gis.stackexchange.com/questions/8650/measuring-accuracy-of-latitude-and-longitude
export const roundDeg = (deg) => (deg.toFixed ? deg.toFixed(5) : deg);

export const positionToDeg = ([lon, lat]: Position) =>
  `${roundDeg(lat)}° ${roundDeg(lon)}°`;

export const positionToDegUrl = ([lon, lat]: Position) =>
  `${roundDeg(lat)},${roundDeg(lon)}`;

// Degrees and Minutes
const toDM = (x) =>
  `${Math.floor(x)}° ${((x - Math.floor(x)) * 60).toFixed(3)}'`;

export const positionToDM = ([lat, lon]: Position) =>
  `${toDM(lat)} ${toDM(lon)}`;

// https://wiki.openstreetmap.org/wiki/Zoom_levels
// https://medium.com/techtrument/how-many-miles-are-in-a-pixel-a0baf4611fff
// const metersPerPxOnEquator = 156543.03392
// const mPerPx = metersPerPxOnEquator * Math.cos(lat * Math.PI / 180) / Math.pow(2, zoom)
export const getRoundedPosition = (
  [lon, lat]: Position,
  zoom: number,
): LonLatRounded => {
  const degPerPx = Math.cos((lat * Math.PI) / 180) / 2 ** zoom;
  const exp = Math.round(Math.log10(degPerPx)) * -1;
  return [lon.toFixed(exp), lat.toFixed(exp), zoom.toFixed(2)];
};

export const roundedToDegUrl = ([lon, lat]: LonLatRounded) => `${lat},${lon}`;
