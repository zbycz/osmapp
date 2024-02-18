// https://cloud.maptiler.com/account

const apiKey = '7dlhLl3hiXQ1gsth0kGu';

export const OSMAPP_SPRITE = `${window.location.protocol}//${window.location.host}/sprites/osmapp`;

export const GLYPHS = `https://api.maptiler.com/fonts/{fontstack}/{range}.pbf?key=${apiKey}`;

export const emptyGeojsonSource = {
  type: 'geojson' as const,
  data: {
    type: 'FeatureCollection',
    features: [],
  },
};

export const OSMAPP_SOURCES = {
  maptiler_planet: {
    type: 'vector' as const,
    url: `https://api.maptiler.com/tiles/v3/tiles.json?key=${apiKey}`,
  },
  contours: {
    type: 'vector' as const,
    url: `https://api.maptiler.com/tiles/contours/tiles.json?key=${apiKey}`,
  },
  'terrain-rgb': {
    url: `https://api.maptiler.com/tiles/terrain-rgb/tiles.json?key=${apiKey}`,
    type: 'raster-dem' as const,
    tileSize: 256,
  },
  terrain: {
    url: `https://api.maptiler.com/tiles/terrain-rgb/tiles.json?key=${apiKey}`,
    type: 'raster-dem' as const,
    tileSize: 256,
  },
  outdoor: {
    url: `https://api.maptiler.com/tiles/outdoor/tiles.json?key=${apiKey}`,
    type: 'vector' as const,
  },
  overpass: emptyGeojsonSource,
};

export const BACKGROUND = [
  {
    id: 'background',
    type: 'background',
    paint: {
      'background-color': '#f8f4f0',
    },
  },
];
