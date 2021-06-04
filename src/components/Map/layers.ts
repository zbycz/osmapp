import mapboxStyle from './mapboxStyle';
import { outdoorStyle } from './outdoorStyle';
import { addHoverPaint } from './hover';
import { SHOW_PROTOTYPE_UI } from '../../config';

export const sources = {
  maptiler_planet: {
    type: 'vector',
    url: 'https://api.maptiler.com/tiles/v3/tiles.json?key=7dlhLl3hiXQ1gsth0kGu', // https://cloud.maptiler.com/account
  },
  contours: {
    type: 'vector',
    url: 'https://api.maptiler.com/tiles/contours/tiles.json?key=7dlhLl3hiXQ1gsth0kGu',
  },
  hillshading: {
    type: 'raster',
    url: 'https://api.maptiler.com/tiles/hillshades/tiles.json?key=7dlhLl3hiXQ1gsth0kGu',
    tileSize: 256,
  },
  'terrain-rgb': {
    url: 'https://api.maptiler.com/tiles/terrain-rgb/tiles.json?key=7dlhLl3hiXQ1gsth0kGu',
    type: 'raster-dem',
  },
  outdoor: {
    url: 'https://api.maptiler.com/tiles/outdoor/tiles.json?key=7dlhLl3hiXQ1gsth0kGu',
    type: 'vector',
  },
  osm_mapnik: {
    type: 'raster',
    tiles: [
      'https://a.tile.openstreetmap.org/{z}/{x}/{y}.png',
      'https://b.tile.openstreetmap.org/{z}/{x}/{y}.png',
    ],
    tileSize: 256,
  },
};

export const backgroundLayers = [
  // {
  //     "id": "simple-tiles",
  //     "type": "raster",
  //     "source": "osm_mapnik",
  //     "minzoom": 0,
  //     "maxzoom": 22
  // },
  {
    id: 'background',
    type: 'background',
    paint: {
      'background-color': '#f8f4f0',
    },
  },
];

const sprite = `${window.location.protocol}//${window.location.host}/sprites/osmapp`;

const getStyle = SHOW_PROTOTYPE_UI ? outdoorStyle : mapboxStyle;
const origStyle = getStyle(sources, backgroundLayers, sprite);

if (SHOW_PROTOTYPE_UI) {
  // TODO add icons for outdoor to our sprite (guideposts, benches, etc)
  // https://api.maptiler.com/maps/outdoor/sprite.png?key=7dlhLl3hiXQ1gsth0kGu

  origStyle.layers.push(
    ...[
      {
        id: 'poi-level-3',
        type: 'symbol',
        source: 'maptiler_planet',
        'source-layer': 'poi',
        minzoom: 16,
        filter: ['all', ['==', '$type', 'Point'], ['>=', 'rank', 25]],
        layout: {
          'text-padding': 2,
          'text-font': ['Noto Sans Regular'],
          'text-anchor': 'top',
          'icon-image': '{class}_11',
          'text-field': '{name:latin}\n{name:nonlatin}',
          'text-offset': [0, 0.6],
          'text-size': 12,
          'text-max-width': 9,
        },
        paint: {
          'text-halo-blur': 0.5,
          'text-color': '#666',
          'text-halo-width': 1,
          'text-halo-color': '#ffffff',
        },
      },
      {
        id: 'poi-level-2',
        type: 'symbol',
        source: 'maptiler_planet',
        'source-layer': 'poi',
        minzoom: 15,
        filter: [
          'all',
          ['==', '$type', 'Point'],
          ['<=', 'rank', 24],
          ['>=', 'rank', 15],
        ],
        layout: {
          'text-padding': 2,
          'text-font': ['Noto Sans Regular'],
          'text-anchor': 'top',
          'icon-image': '{class}_11',
          'text-field': '{name:latin}\n{name:nonlatin}',
          'text-offset': [0, 0.6],
          'text-size': 12,
          'text-max-width': 9,
        },
        paint: {
          'text-halo-blur': 0.5,
          'text-color': '#666',
          'text-halo-width': 1,
          'text-halo-color': '#ffffff',
        },
      },
      {
        id: 'poi-level-1',
        type: 'symbol',
        source: 'maptiler_planet',
        'source-layer': 'poi',
        minzoom: 14,
        filter: [
          'all',
          ['==', '$type', 'Point'],
          ['<=', 'rank', 14],
          ['has', 'name'],
        ],
        layout: {
          'text-padding': 2,
          'text-font': ['Noto Sans Regular'],
          'text-anchor': 'top',
          'icon-image': '{class}_11',
          'text-field': '{name:latin}\n{name:nonlatin}',
          'text-offset': [0, 0.6],
          'text-size': 12,
          'text-max-width': 9,
        },
        paint: {
          'text-halo-blur': 0.5,
          'text-color': '#666',
          'text-halo-width': 1,
          'text-halo-color': '#ffffff',
        },
      },
      {
        id: 'poi-railway',
        type: 'symbol',
        source: 'maptiler_planet',
        'source-layer': 'poi',
        minzoom: 13,
        maxzoom: 24,
        filter: [
          'all',
          ['==', '$type', 'Point'],
          ['has', 'name'],
          ['==', 'class', 'railway'],
          ['==', 'subclass', 'station'],
        ],
        layout: {
          'text-padding': 2,
          'text-font': ['Noto Sans Regular'],
          'text-anchor': 'top',
          'icon-image': '{class}_11',
          'text-field': '{name:latin}\n{name:nonlatin}',
          'text-offset': [0, 0.6],
          'text-size': 12,
          'text-max-width': 9,
          'icon-optional': false,
          'icon-ignore-placement': false,
          'icon-allow-overlap': false,
          'text-ignore-placement': false,
          'text-allow-overlap': false,
          'text-optional': true,
        },
        paint: {
          'text-halo-blur': 0.5,
          'text-color': '#666',
          'text-halo-width': 1,
          'text-halo-color': '#ffffff',
        },
      },
    ],
  );
}
export const style = addHoverPaint(origStyle);

const isOsmLayer = (id) => {
  if (id === 'place-country-3') return false; // "Czechia" not clickable :-(
  const prefixes = ['water-name-', 'poi-', 'place-'];
  return prefixes.some((prefix) => id.startsWith(prefix));
};
export const layersWithOsmId = style.layers
  .map((x) => x.id)
  .filter((id) => isOsmLayer(id));
