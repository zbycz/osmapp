import maplibregl from 'maplibre-gl';
import IndoorEqual from 'maplibre-gl-indoorequal';
import 'maplibre-gl-indoorequal/maplibre-gl-indoorequal.css';

let indoorEqual: IndoorEqual;

export const addIndoorEqual = (map: maplibregl.Map) => {
  if (!process.env.NEXT_PUBLIC_API_KEY_INDOOREQUAL) {
    throw new Error('Missing API key for IndoorEqual');
  }

  console.log('Adding IndoorEqual');
  indoorEqual = new IndoorEqual(map, {
    apiKey: process.env.NEXT_PUBLIC_API_KEY_INDOOREQUAL,
    heatmap: false,
  });
  indoorEqual.loadSprite('/icons-indoor/sprite/indoorequal');

  map.addControl(indoorEqual);
};

export const removeIndoorEqual = (map: maplibregl.Map) => {
  if (indoorEqual && indoorEqual._control) {
    console.log('Removing IndoorEquall', map, indoorEqual);
    map.removeControl(indoorEqual);
    indoorEqual = null;
  }
};
