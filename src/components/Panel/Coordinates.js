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
    const type = feature.geometry.type;

    // node
    if (!type || type === 'Point') {
      return <Coords coords={feature.geometry.coordinates} />;

      // way
    } else if (type === 'LineString' || type === 'Polygon') {
      let ex;
      try {
        ex = geojsonExtent(feature); //[WSEN]
      } catch (e) {
        console.warn(e);
        return 'Unknown center of geojson';
      }

      const avg = (a, b) => (a + b) / 2; //flat earth rulezz
      const lon = avg(ex[0], ex[2]);
      const lat = avg(ex[1], ex[3]);
      return <Coords coords={[lon, lat]} />;
    } else {
      return `Unknown geometry ${type}`;
    }
  } else {
    return 'Invalid input';
  }
};

export default Coordinates;
