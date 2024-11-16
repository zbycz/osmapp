import { FilterSpecification, GeoJSONSource, Map } from 'maplibre-gl';

const SOURCE_NAME = 'turn-by-turn';
const LINE_WIDTH = 8;
const OUTLINE_WIDTH = 6;

const filterStatus = (value: string): FilterSpecification => [
  '==',
  ['get', 'status'],
  value,
];

type Props = {
  status: 'completed' | 'uncompleted';
  outlineColor: string;
  color: string;
};

const addOutlinedLayer = (map: Map, { status, outlineColor, color }: Props) => {
  map.addLayer({
    id: `${status}-route-outline`,
    type: 'line',
    source: SOURCE_NAME,
    filter: filterStatus(status),
    layout: {
      'line-cap': 'round',
      'line-join': 'round',
    },
    paint: {
      'line-color': outlineColor,
      'line-width': LINE_WIDTH + OUTLINE_WIDTH,
    },
  });
  map.addLayer({
    id: `${status}-route`,
    type: 'line',
    source: SOURCE_NAME,
    filter: filterStatus(status),
    layout: {
      'line-cap': 'round',
      'line-join': 'round',
    },
    paint: {
      'line-color': color,
      'line-width': LINE_WIDTH,
    },
  });
};

export const createSource = (map: Map) => {
  map.addSource(SOURCE_NAME, {
    type: 'geojson',
    data: {
      type: 'FeatureCollection',
      features: [],
    },
  });

  addOutlinedLayer(map, {
    status: 'completed',
    outlineColor: '#D14D4D',
    color: '#F5ABAB',
  });
  addOutlinedLayer(map, {
    status: 'uncompleted',
    outlineColor: '#B74343',
    color: '#EB5757',
  });
};

export const getSource = (map: Map) => {
  if (map.getSource(SOURCE_NAME)) {
    return map.getSource<GeoJSONSource>(SOURCE_NAME);
  }

  createSource(map);
  return map.getSource<GeoJSONSource>(SOURCE_NAME);
};
