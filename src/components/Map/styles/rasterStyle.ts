import maplibregl from 'maplibre-gl';
import { GLYPHS, OSMAPP_SOURCES, OSMAPP_SPRITE } from '../consts';

export const rasterStyle = (id, url): maplibregl.Style => {
  const source = url.match('{x}')
    ? {
        tiles: ['a', 'b', 'c'].map((c) => url?.replace('{s}', c)),
      }
    : {
        url, // tileset.json
      };
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
