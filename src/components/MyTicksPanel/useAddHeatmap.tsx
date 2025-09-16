import { useEffect } from 'react';
import { getGlobalMap } from '../../services/mapStorage';
import { FetchedClimbingTick } from '../../services/my-ticks/getMyTicks';
import { FeatureCollection } from 'geojson';
import type { LayerSpecification } from '@maplibre/maplibre-gl-style-spec';
import type { GeoJSONSource } from 'maplibre-gl';

const LAYER_ID = 'myticks-heatmap';
const SOURCE_ID = 'myticks';
const LAYER: LayerSpecification = {
  id: LAYER_ID,
  type: 'heatmap',
  source: SOURCE_ID,
  paint: {
    'heatmap-weight': 1,
    'heatmap-radius': 9,
    'heatmap-intensity': 1,
    'heatmap-color': [
      'interpolate',
      ['linear'],
      ['heatmap-density'],
      0,
      'rgba(33,102,172,0)',
      0.2,
      'rgb(52,95,175)',
      0.4,
      'rgb(209,229,240)',
      0.6,
      'rgb(253,219,199)',
      0.8,
      'rgb(239,138,98)',
      1,
      'rgb(178,24,43)',
    ],
  },
};

const generateGeojson = (
  tickRows: FetchedClimbingTick[],
): FeatureCollection => ({
  type: 'FeatureCollection',
  features: tickRows
    .filter((tickRow) => tickRow.center)
    .map((tickRow) => ({
      type: 'Feature',
      geometry: { type: 'Point', coordinates: tickRow.center },
      properties: {
        mag: 1,
      },
    })),
});

export const useAddHeatmap = (tickRows: FetchedClimbingTick[]) => {
  useEffect(() => {
    const map = getGlobalMap();
    if (!map) return;

    const geojson = generateGeojson(tickRows);

    const ensureHeatmap = () => {
      if (!map.getSource(SOURCE_ID)) {
        map.addSource(SOURCE_ID, {
          type: 'geojson',
          data: geojson,
        });
      } else {
        const source = map.getSource(SOURCE_ID) as GeoJSONSource;
        source.setData(geojson);
      }

      if (!map.getLayer(LAYER_ID)) {
        map.addLayer(LAYER);
      }
    };

    map.on('styledata', ensureHeatmap);

    if (map.isStyleLoaded()) {
      ensureHeatmap();
    } else {
      map.once('load', ensureHeatmap);
    }

    return () => {
      map.off('styledata', ensureHeatmap);

      if (map.getLayer(LAYER_ID)) {
        map.removeLayer(LAYER_ID);
      }
      if (map.getSource(SOURCE_ID)) {
        map.removeSource(SOURCE_ID);
      }
    };
  }, [tickRows]);
};
