import { useMapEffect } from '../../helpers';
import { basicStyle } from '../styles/basicStyle';
import { outdoorStyle } from '../styles/outdoorStyle';
import { osmappLayers } from '../../LayerSwitcher/osmappLayers';
import { rasterStyle } from '../styles/rasterStyle';
import { DEFAULT_MAP } from '../../../config';

export const getRasterLayer = (key) => {
  const url = osmappLayers[key]?.url ?? key; // if `key` not found, it contains tiles URL
  return rasterStyle(key, url);
};

export const useUpdateStyle = useMapEffect((map, activeLayers) => {
  const key = activeLayers[0] ?? DEFAULT_MAP;
  map.setMaxZoom(osmappLayers[key]?.maxzoom ?? 24); // TODO find a way how to zoom bing further (now it stops at 19)
  map.setStyle(
    key === 'basic'
      ? basicStyle
      : key === 'outdoor'
      ? outdoorStyle
      : getRasterLayer(key),
  );

  map.addSource('overpass', {
    type: 'geojson',
    data: {
      type: 'FeatureCollection',
      features: [],
    },
  });
  map.addLayer({
    id: 'overpass',
    type: 'line',
    source: 'overpass',
    paint: {
      'line-color': '#f00',
      'line-width': 2,
    },
  });
  map.addLayer({
    id: 'overpass-fill',
    type: 'fill',
    source: 'overpass',
    paint: {
      'fill-color': '#f00',
      'fill-opacity': 0.5,
    },
  });
  map.addLayer({
    id: 'overpass-circle',
    type: 'circle',
    source: 'overpass',
    paint: {
      'circle-color': '#f00',
      'circle-radius': 5,
    },
  });
  map.addLayer({
    id: 'overpass-text',
    type: 'symbol',
    source: 'overpass',
    layout: {
      'text-field': ['get', 'name'],
      'text-font': ['Open Sans Semibold', 'Arial Unicode MS Bold'],
      'text-size': 12,
    },
    paint: {
      'text-color': '#f00',
    },
  });
});
