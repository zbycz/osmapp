// Accuracy = 1m, see https://gis.stackexchange.com/questions/8650/measuring-accuracy-of-latitude-and-longitude
export const toDeg = (lat, lon) => `${lat.toFixed(5)}° ${lon.toFixed(5)}°`;

const coordToDM = (x) =>
  `${Math.floor(x)}° ${((x - Math.floor(x)) * 60).toFixed(3)}'`;

export const toDM = (lat, lon) => `${coordToDM(lat)} ${coordToDM(lon)}`;
