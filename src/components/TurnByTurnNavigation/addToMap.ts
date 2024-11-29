import { Map } from 'maplibre-gl';
import { LonLat } from '../../services/types';
import { getSource } from './layer';

export const addToMap = (
  map: Map,
  completed: LonLat[],
  uncompleted: LonLat[],
) => {
  getSource(map).setData({
    type: 'FeatureCollection',
    features: [
      {
        type: 'Feature',
        geometry: {
          type: 'LineString',
          coordinates: completed,
        },
        properties: { status: 'completed' },
      },
      {
        type: 'Feature',
        geometry: {
          type: 'LineString',
          coordinates: uncompleted,
        },
        properties: { status: 'uncompleted' },
      },
    ],
  });
};

export const resetMapRoute = (map: Map) => {
  getSource(map).setData({
    type: 'FeatureCollection',
    features: [],
  });
};
