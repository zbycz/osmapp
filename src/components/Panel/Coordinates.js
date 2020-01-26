// @flow

import * as React from 'react';
import { getCenterOfFeature } from '../../services/osmApi';

// Accuracy = 1m, see https://gis.stackexchange.com/questions/8650/measuring-accuracy-of-latitude-and-longitude
const round = x => x.toFixed(5);

export const Coords = ({ coords: [lon, lat] }) => (
  <>
    {round(lat)}° {round(lon)}°
  </>
);

const Coordinates = ({ feature: { center } }) => {
  if (center === undefined) {
    console.warn('Coordinates cant be rendered: center =', center);
    return null;
  }
  return <Coords coords={center} />;
};

export default Coordinates;
