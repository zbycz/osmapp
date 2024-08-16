import { useEffect } from 'react';
import { getGlobalMap } from '../../services/mapStorage';
import { TickRowType } from '../../services/my-ticks/getMyTicks';
import { FeatureCollection } from 'geojson';
import type { LayerSpecification } from '@maplibre/maplibre-gl-style-spec';

const LAYER_ID = 'myticks-heatmap';
const SOURCE_ID = 'myticks';

const LAYER: LayerSpecification = {
  id: LAYER_ID,
  type: 'heatmap',
  source: 'myticks',
  paint: {
    'heatmap-weight': ['interpolate', ['linear'], ['get', 'mag'], 0, 0, 6, 1],
    'heatmap-color': [
      'interpolate',
      ['linear'],
      ['heatmap-density'],
      0,
      'rgba(33,102,172,0)',
      0.2,
      'rgb(103,169,207)',
      0.4,
      'rgb(209,229,240)',
      0.6,
      'rgb(253,219,199)',
      0.8,
      'rgb(239,138,98)',
      1,
      'rgb(178,24,43)',
    ],
    'heatmap-intensity': ['interpolate', ['linear'], ['zoom'], 0, 1, 9, 3],
    'heatmap-radius': ['interpolate', ['linear'], ['zoom'], 0, 2, 9, 15],
  },
};

const generateGeojson = (tickRows: TickRowType[]): FeatureCollection => ({
  type: 'FeatureCollection',
  features: tickRows.map((tickRow) => ({
    type: 'Feature',
    geometry: { type: 'Point', coordinates: tickRow.center },
    properties: null,
  })),
});

export const useAddHeatmap = (tickRows: TickRowType[]) => {
  useEffect(() => {
    const map = getGlobalMap();

    if (map && tickRows) {
      map.addSource(SOURCE_ID, {
        type: 'geojson',
        data: generateGeojson(tickRows),
      });
      map.addLayer(LAYER);
    }

    return () => {
      if (map) {
        map.removeLayer(LAYER_ID);
        if (map.getSource(SOURCE_ID)) {
          map.removeSource(SOURCE_ID);
        }
      }
    };
  }, [tickRows]);
};
