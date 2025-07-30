import { GeoJSONSource } from 'maplibre-gl';
import { fetchJson } from '../../../services/fetch';
import { EMPTY_GEOJSON_SOURCE, OSMAPP_SPRITE } from '../consts';
import { getGlobalMap } from '../../../services/mapStorage';
import { climbingLayers } from './climbingLayers/climbingLayers';
import type { StyleSpecification } from '@maplibre/maplibre-gl-style-spec';
import {
  ClimbingTilesFeature,
  ClimbingTilesProperties,
  Tile,
} from '../../../types';
import { computeTiles } from './computeTiles';
import { CLIMBING_TILES_HOST } from '../../../services/osm/consts';
import { CLIMBING_SPRITE, CLIMBING_TILES_SOURCE } from './consts';
import {
  GRADE_TABLE,
  gradeColors,
} from '../../../services/tagging/climbing/gradeData';

const getTileJson = async ({ z, x, y }: Tile) => {
  try {
    const url = `${CLIMBING_TILES_HOST}api/climbing-tiles/tile?z=${z}&x=${x}&y=${y}`;
    const data = await fetchJson(url); // this is cached by fetchCache
    return (data.features || []) as ClimbingTilesFeature[];
  } catch (e) {
    console.warn('climbingTiles fetch error:', e); // eslint-disable-line no-console
    return [];
  }
};

const getColor = (properties: ClimbingTilesProperties): string | undefined => {
  if (properties.type === 'route' && properties.gradeId) {
    return gradeColors[GRADE_TABLE.uiaa[properties.gradeId]]?.light;
  }

  return undefined;
};

const processFeature = (
  feature: ClimbingTilesFeature,
): ClimbingTilesFeature => {
  const properties = feature.properties;

  const color = getColor(properties);
  return {
    ...feature,
    properties: {
      ...properties,
      ...(color ? { color } : {}),
    },
  };
};

const updateData = async () => {
  const map = getGlobalMap();
  const mapZoom = map.getZoom();
  const z = mapZoom >= 13 ? 12 : mapZoom >= 10 ? 9 : mapZoom >= 7 ? 6 : 0;

  const bounds = map.getBounds();
  const northWest = bounds.getNorthWest();
  const southEast = bounds.getSouthEast();

  const tiles = computeTiles(z, northWest, southEast);

  const promises = tiles.map((tile) => getTileJson(tile)); // TODO consider showing results after each tile is loaded
  const data = await Promise.all(promises);

  const features: ClimbingTilesFeature[] = [];
  for (const tileFeatures of data) {
    features.push(...tileFeatures);
  }

  map?.getSource<GeoJSONSource>(CLIMBING_TILES_SOURCE)?.setData({
    type: 'FeatureCollection' as const,
    features: features.map(processFeature),
  });
};

let eventsAdded = false;

export const addClimbingTilesSource = (style: StyleSpecification) => {
  style.sources[CLIMBING_TILES_SOURCE] = EMPTY_GEOJSON_SOURCE;
  style.sprite = [...OSMAPP_SPRITE, CLIMBING_SPRITE];
  style.layers.push(...climbingLayers); // must be also in `layersWithOsmId` because of hover effect

  if (!eventsAdded) {
    const map = getGlobalMap();
    map.on('load', updateData);
    map.on('moveend', updateData);
    eventsAdded = true;
  }
};

export const removeClimbingTilesSource = () => {
  if (eventsAdded) {
    const map = getGlobalMap();
    map.off('load', updateData);
    map.off('moveend', updateData);
    eventsAdded = false;
  }
};
