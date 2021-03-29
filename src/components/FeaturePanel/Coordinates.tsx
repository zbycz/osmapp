import * as React from 'react';

// Accuracy = 1m, see https://gis.stackexchange.com/questions/8650/measuring-accuracy-of-latitude-and-longitude
const round = (x) => x.toFixed(5);

export const Coords = ({ coords: [lon, lat] }) =>
  lon != null &&
  lat != null && (
    <span title="latitude, longitude (y,x)">
      {round(lat)}° {round(lon)}°
    </span>
  );

const Coordinates = ({ feature: { center } }) =>
  center === undefined ? null : <Coords coords={center} />;

export default Coordinates;
