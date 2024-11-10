import { GeoJSONSource, Map } from 'maplibre-gl';

const SOURCE_NAME = 'turn-by-turn';

export const createSource = (map: Map) => {
  map.addSource(SOURCE_NAME, {
    type: 'geojson',
    data: {
      type: 'FeatureCollection',
      features: [],
    },
  });

  map.addLayer({
    id: 'completed-route',
    type: 'line',
    source: SOURCE_NAME,
    filter: ['==', ['get', 'status'], 'completed'],
    layout: {
      'line-cap': 'round',
      'line-join': 'round',
    },
    paint: {
      'line-color': '#00FF00',
      'line-width': 4,
    },
  });

  map.addLayer({
    id: 'uncompleted-route',
    type: 'line',
    source: SOURCE_NAME,
    filter: ['==', ['get', 'status'], 'uncompleted'],
    layout: {
      'line-cap': 'round',
      'line-join': 'round',
    },
    paint: {
      'line-color': '#FF0000',
      'line-width': 4,
      'line-dasharray': [2, 2],
    },
  });
};

export const getSource = (map: Map) => {
  if (map.getSource(SOURCE_NAME)) {
    return map.getSource<GeoJSONSource>(SOURCE_NAME);
  }

  createSource(map);
  return map.getSource<GeoJSONSource>(SOURCE_NAME);
};
