import React from 'react';
import { TilesOption } from '../types';
import GridViewIcon from '@mui/icons-material/GridView';
import { Grid, Typography } from '@mui/material';
import { IconPart } from '../utils';
import { getGlobalMap } from '../../../services/mapStorage';
import { tileToBBOX } from '../../../server/climbing-tiles/tileToBBOX';
import maplibregl from 'maplibre-gl';
import type { GeoJSONSource } from 'maplibre-gl';

const tileRegex = /^(\d+)\/(\d+)\/(\d+)$/;

const TILE_SOURCE_ID = 'tile-bbox';
const TILE_LAYER_ID = 'tile-bbox-layer';

export const getTilesOption = (inputValue: string): TilesOption[] => {
  const match = inputValue.trim().match(tileRegex);
  if (!match) {
    return [];
  }

  const z = parseInt(match[1], 10);
  const x = parseInt(match[2], 10);
  const y = parseInt(match[3], 10);

  if (z < 0 || z > 25) return [];
  if (x < 0 || x >= Math.pow(2, z)) return [];
  if (y < 0 || y >= Math.pow(2, z)) return [];

  return [
    {
      type: 'tiles',
      tiles: { z, x, y, label: `${z}/${x}/${y}` },
    },
  ];
};

export const tilesOptionSelected = ({ tiles }: TilesOption) => {
  const map = getGlobalMap();
  if (!map) return;

  const { z, x, y } = tiles;
  const [w, s, e, n] = tileToBBOX({ z, x, y });

  const geojson: GeoJSON.FeatureCollection = {
    type: 'FeatureCollection',
    features: [
      {
        type: 'Feature',
        geometry: {
          type: 'Polygon',
          coordinates: [
            [
              [w, n],
              [e, n],
              [e, s],
              [w, s],
              [w, n],
            ],
          ],
        },
        properties: { tile: `${z}/${x}/${y}` },
      },
    ],
  };

  if (!map.getSource(TILE_SOURCE_ID)) {
    map.addSource(TILE_SOURCE_ID, {
      type: 'geojson',
      data: geojson,
    });
  } else {
    const source = map.getSource(TILE_SOURCE_ID) as GeoJSONSource;
    source.setData(geojson);
  }

  if (!map.getLayer(TILE_LAYER_ID)) {
    map.addLayer({
      id: TILE_LAYER_ID,
      type: 'line',
      source: TILE_SOURCE_ID,
      paint: {
        'line-color': '#ff0000',
        'line-width': 3,
      },
    });
  }

  const bbox = new maplibregl.LngLatBounds([w, s], [e, n]);
  const panelWidth = window.innerWidth > 700 ? 410 : 0;
  map.fitBounds(bbox, {
    padding: { top: 5, bottom: 5, right: 5, left: panelWidth + 5 },
  });
};

type Props = {
  option: TilesOption;
};

export const TilesRow = ({ option: { tiles } }: Props) => (
  <>
    <IconPart>
      <GridViewIcon />
    </IconPart>
    <Grid size={12}>
      <span style={{ fontWeight: 700 }}>{tiles.label}</span>
      <Typography variant="body2" color="textSecondary">
        z/x/y tile boundaries
      </Typography>
    </Grid>
  </>
);
