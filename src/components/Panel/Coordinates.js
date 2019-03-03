// @flow

import * as React from 'react';

import geojsonExtent from '@mapbox/geojson-extent';

// Accuracy = 1m, see https://gis.stackexchange.com/questions/8650/measuring-accuracy-of-latitude-and-longitude
const round = x => x.toFixed(5);

export const Coords = ({ coords: [lon, lat] }) => (
  <>
    {round(lon)}° {round(lat)}°
  </>
);

const Coordinates = ({ coords, feature }) => {
  if (coords) {
    return <Coords coords={coords} />;
  } else if (feature && feature.geometry) {
    // node
    if (!feature.geometry.type) {
      return <Coords coords={feature.geometry.coordinates} />;

      // way
    } else if (feature.geometry.type === 'LineString') {
      const ex = geojsonExtent(feature); //[WSEN]

      const avg = (a, b) => (a + b) / 2; //flat earth rulezz
      const lon = avg(ex[0], ex[2]);
      const lat = avg(ex[1], ex[3]);
      const center = [lon, lat];
      return <Coords coords={center} />;
    }
  } else {
    return 'Invalid input';
  }
};

export default Coordinates;
