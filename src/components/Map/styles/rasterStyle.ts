import maplibregl from 'maplibre-gl';
import { GLYPHS, OSMAPP_SOURCES, OSMAPP_SPRITE } from '../consts';

const getSource = (url) => {
  if (url.match('{bingSubdomains}')) {
    return {
      tiles: ['t0', 't1', 't2', 't3'].map((c) =>
        url?.replace('{bingSubdomains}', c),
      ),
    };
  }

  if (url.match('{x}')) {
    return {
      tiles: ['a', 'b', 'c'].map((c) => url?.replace('{s}', c)),
    };
  }

  return {
    url, // url as a tileset.json
  };
};

export const rasterStyle = (id, url): maplibregl.Style => {
  const source = getSource(url);
  return {
    version: 8,
    sprite: OSMAPP_SPRITE,
    glyphs: GLYPHS,
    layers: [
      {
        id,
        type: 'raster',
        paint: { 'raster-opacity': 1 },
        filter: ['all'],
        layout: { visibility: 'visible' },
        source: id,
        minzoom: 0,
      },
      // ...poiLayers, // TODO maybe add POIs
    ],
    sources: {
      ...OSMAPP_SOURCES, // keep default sources for faster switching
      [id]: {
        type: 'raster' as const,
        tileSize: 256,
        ...source,
      },
    },
  };
};
