import IndoorEqual from 'maplibre-gl-indoorequal';
import 'maplibre-gl-indoorequal/maplibre-gl-indoorequal.css';
import { getGlobalMap, mapIdlePromise } from '../../../services/mapStorage';

const timeout = (ms: number) =>
  new Promise((resolve) => setTimeout(resolve, ms));

let indoorEqual: IndoorEqual;

export const addIndoorEqual = async () => {
  if (!process.env.NEXT_PUBLIC_API_KEY_INDOOREQUAL) {
    throw new Error('Missing API key for IndoorEqual');
  }

  // TODO this is brittle, we can probably get rid of the library and implement indoor ourselves
  // TODO 2: doesnt work in hot reload mode (localhost)
  await timeout(600);
  const map = await mapIdlePromise;

  console.log('Adding IndoorEqual'); // eslint-disable-line no-console
  indoorEqual = new IndoorEqual(map, {
    apiKey: process.env.NEXT_PUBLIC_API_KEY_INDOOREQUAL,
    heatmap: false,
  });
  indoorEqual.loadSprite('/icons-indoor/sprite/indoorequal');

  map.addControl(indoorEqual);
};

export const removeIndoorEqual = () => {
  if (indoorEqual && indoorEqual._control) {
    const map = getGlobalMap();
    console.log('Removing IndoorEquall', map, indoorEqual); // eslint-disable-line no-console
    map.removeControl(indoorEqual);
    indoorEqual = null;
  }
};
