import { GeoJSONSource } from 'maplibre-gl';
import { fetchJson } from '../../../services/fetch';
import { EMPTY_GEOJSON_SOURCE, OSMAPP_SPRITE } from '../consts';
import { getGlobalMap } from '../../../services/mapStorage';
import type { StyleSpecification } from '@maplibre/maplibre-gl-style-spec';
import { Tile } from '../../../types';
import { computeTiles } from './computeTiles';
import { CLIMBING_TILES_HOST } from '../../../services/osm/consts';
import { CLIMBING_SPRITE, CLIMBING_TILES_SOURCE } from './consts';
import { ClimbingFilters } from './climbingFiltersUtils';
import { getClimbingLayers } from './climbingLayers/climbingLayers';

const getTileJson = async ({ z, x, y }: Tile) => {
  const url = `${CLIMBING_TILES_HOST}api/climbing-tiles/tile?z=${z}&x=${x}&y=${y}`;
  const data = await fetchJson(url);
  return data.features || [];
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

  const features = [];
  for (const tileFeatures of data) {
    features.push(...tileFeatures);
  }

  map?.getSource<GeoJSONSource>(CLIMBING_TILES_SOURCE)?.setData({
    type: 'FeatureCollection' as const,
    features,
  });
};

let eventsAdded = false;

export function addClimbingTilesSource(
  style: StyleSpecification,
  climbingFilters: ClimbingFilters,
): void {
  style.sources[CLIMBING_TILES_SOURCE] = EMPTY_GEOJSON_SOURCE;
  style.sprite = [...OSMAPP_SPRITE, CLIMBING_SPRITE];

  const layersToAdd = getClimbingLayers(climbingFilters);
  style.layers = [...(style.layers ?? []), ...layersToAdd];

  if (!eventsAdded) {
    const map = getGlobalMap();
    map.on('load', updateData);
    map.on('moveend', updateData);
    eventsAdded = true;
  }
}

export const removeClimbingTilesSource = () => {
  if (eventsAdded) {
    const map = getGlobalMap();
    map.off('load', updateData);
    map.off('moveend', updateData);
    eventsAdded = false;
  }
};
