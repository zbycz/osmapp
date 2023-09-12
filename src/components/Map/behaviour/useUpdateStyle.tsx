import { useMapEffect } from '../../helpers';
import { basicStyle } from '../styles/basicStyle';
import { outdoorStyle } from '../styles/outdoorStyle';
import { osmappLayers } from '../../LayerSwitcher/osmappLayers';
import { rasterStyle } from '../styles/rasterStyle';
import { DEFAULT_MAP } from '../../../config';

export const getRasterStyle = (key) => {
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
      : getRasterStyle(key),
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
    //   'line-width': 2
    // },
    // layout: {
    //   'text-font': ['Noto Sans Regular'],
    //   'text-field': '{name:latin} {name:nonlatin}',
    //   'symbol-placement': 'line',
    //   'text-size': 14,
    //   'text-rotation-alignment': 'map'
    }
  });
  map.addLayer({
    id: 'overpass-fill',
    type: 'fill',
    source: 'overpass',
    filter: [
      'all',
      ['==', '$type', 'Polygon'],
    ],
    paint: {
      'fill-color': '#f00',
      'fill-opacity': 0.5,
    },
  });
  map.addLayer({
    id: 'overpass-circle',
    type: 'circle',
    source: 'overpass',
    filter: [
      'all',
      ['==', '$type', 'Point'],
    ],
    paint: {
      'circle-color': '#00f',
      'circle-radius': 5,
    },
  });

  map.addLayer({
    id: 'overpass-text',
    type: 'symbol',
    source: 'overpass',
    layout: {
      'text-letter-spacing': 0.1,
      'text-size': 14,
      'text-font': ['Noto Sans Bold'],
      'text-field': '{name:latin}\n{name:nonlatin}',
      'text-transform': 'uppercase',
      'text-max-width': 9,
      visibility: 'visible',
    },
    paint: {
      'text-color': '#0f0',
    },
  });
});
