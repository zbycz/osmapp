import type {
  GeoJSONSourceSpecification,
  SourceSpecification,
} from '@maplibre/maplibre-gl-style-spec';

const apiKey = process.env.NEXT_PUBLIC_API_KEY_MAPTILER;

export const OSMAPP_SPRITE = [
  {
    id: 'default',
    url: `${window.location.protocol}//${window.location.host}/sprites/osmapp`,
  },
];

export const GLYPHS = `https://api.maptiler.com/fonts/{fontstack}/{range}.pbf?key=${apiKey}`;

export const EMPTY_GEOJSON_SOURCE: GeoJSONSourceSpecification = {
  type: 'geojson' as const,
  data: {
    type: 'FeatureCollection' as const,
    features: [],
  },
};

export const OSMAPP_SOURCES: Record<string, SourceSpecification> = {
  maptiler_planet: {
    type: 'vector' as const,
    url: `https://api.maptiler.com/tiles/v3/tiles.json?key=${apiKey}`,
  },
  contours: {
    type: 'vector' as const,
    url: `https://api.maptiler.com/tiles/contours-v2/tiles.json?key=${apiKey}`,
  },
  terrain3d: {
    url: `https://api.maptiler.com/tiles/terrain-rgb-v2/tiles.json?key=${apiKey}`, // this source must be duplicated for terrain/hillshade https://github.com/maplibre/maplibre-gl-js/issues/2035
    type: 'raster-dem' as const,
    tileSize: 256,
  },
  terrainHillshade: {
    url: `https://api.maptiler.com/tiles/terrain-rgb-v2/tiles.json?key=${apiKey}`,
    type: 'raster-dem' as const,
    tileSize: 256,
  },
  outdoor: {
    url: `https://api.maptiler.com/tiles/outdoor/tiles.json?key=${apiKey}`,
    type: 'vector' as const,
  },
  overpass: EMPTY_GEOJSON_SOURCE,
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
