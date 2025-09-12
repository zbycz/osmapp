import { OsmItem, OsmResponse } from '../types';
import { overpassToGeojsons } from '../overpassToGeojsons';

const otherCrag: OsmItem = {
  type: 'node',
  id: 111,
  lat: 49.6601234,
  lon: 14.2571299,
  tags: {
    climbing: 'crag',
    'climbing:sport': '50',
    name: 'Other crag in Roviště',
  },
};

const response: OsmResponse = {
  osm3s: { timestamp_osm_base: 'string' }, // overpass only
  elements: [
    otherCrag,
    {
      type: 'node',
      id: 11580052710,
      lat: 49.6600391,
      lon: 14.2573987,
      tags: {
        climbing: 'route_bottom',
        'climbing:grade:uiaa': '1+', // so the histogram is shorter
        name: 'Lída',
        wikimedia_commons: 'File:Roviště - Hafty2.jpg',
        'wikimedia_commons:path': '0.67,0.601|0.66,0.442A',
      },
    },
    {
      type: 'node',
      id: 12361011879,
      lat: 49.6601234,
      lon: 14.2571299,
      tags: {
        climbing: 'route',
        'climbing:grade:uiaa': '1-',
        name: 'Bílé ticho',
      },
    },
    {
      type: 'relation',
      id: 17130663,
      members: [
        { type: 'node', ref: 12361011879, role: '' },
        { type: 'node', ref: 11580052710, role: '' },
      ],
      tags: {
        climbing: 'crag',
        name: 'Yosemite (Hafty)',
        wikimedia_commons: 'File:Roviště - Hafty.jpg',
      },
    },
    {
      type: 'relation',
      id: 17130099,
      members: [
        { type: 'relation', ref: 17130663, role: '' },
        { type: 'node', ref: 111, role: '' },
      ],
      tags: { climbing: 'area', name: 'Roviště' },
    },
    {
      type: 'relation',
      id: 999,
      members: [{ type: 'relation', ref: 17130099, role: '' }],
      tags: { climbing: 'area', name: 'Area of areas' },
    },
  ],
};

test('climbingTiles overpassToGeojson basic', () => {
  const result = overpassToGeojsons(response, () => {});

  expect(result.node).toEqual([
    {
      center: [14.2571299, 49.6601234],
      geometry: { coordinates: [14.2571299, 49.6601234], type: 'Point' },
      id: 1110,
      osmMeta: { id: 111, type: 'node' },
      properties: { hasImages: false, routeCount: 50, parentId: 17130099 },
      tags: {
        climbing: 'crag',
        'climbing:sport': '50',
        name: 'Other crag in Roviště',
      },
      type: 'Feature',
    },
    {
      center: [14.2573987, 49.6600391],
      geometry: { coordinates: [14.2573987, 49.6600391], type: 'Point' },
      id: 115800527100,
      osmMeta: { id: 11580052710, type: 'node' },
      properties: { hasImages: true, parentId: 17130663 },
      tags: {
        climbing: 'route_bottom',
        'climbing:grade:uiaa': '1+',
        name: 'Lída',
        wikimedia_commons: 'File:Roviště - Hafty2.jpg',
        'wikimedia_commons:path': '0.67,0.601|0.66,0.442A',
      },
      type: 'Feature',
    },
    {
      center: [14.2571299, 49.6601234],
      geometry: { coordinates: [14.2571299, 49.6601234], type: 'Point' },
      id: 123610118790,
      osmMeta: { id: 12361011879, type: 'node' },
      properties: { hasImages: false, parentId: 17130663 },
      tags: {
        climbing: 'route',
        'climbing:grade:uiaa': '1-',
        name: 'Bílé ticho',
      },
      type: 'Feature',
    },
  ]);

  expect(result.relation).toEqual([
    {
      center: [14.2572643, 49.660081250000005],
      geometry: {
        geometries: [
          {
            geometries: [
              {
                geometries: [
                  { coordinates: [14.2571299, 49.6601234], type: 'Point' },
                  { coordinates: [14.2573987, 49.6600391], type: 'Point' },
                ],
                type: 'GeometryCollection',
              },
              { coordinates: [14.2571299, 49.6601234], type: 'Point' },
            ],
            type: 'GeometryCollection',
          },
        ],
        type: 'GeometryCollection',
      },
      id: 9994,
      members: [{ ref: 17130099, role: '', type: 'relation' }],
      osmMeta: { id: 999, type: 'relation' },
      properties: {
        hasImages: true,
        histogram: [1, undefined, 1],
        routeCount: 52,
      },
      tags: { climbing: 'area', name: 'Area of areas' },
      type: 'Feature',
    },
    {
      center: [14.2572643, 49.660081250000005],
      geometry: {
        geometries: [
          {
            geometries: [
              { coordinates: [14.2571299, 49.6601234], type: 'Point' },
              { coordinates: [14.2573987, 49.6600391], type: 'Point' },
            ],
            type: 'GeometryCollection',
          },
          { coordinates: [14.2571299, 49.6601234], type: 'Point' },
        ],
        type: 'GeometryCollection',
      },
      id: 171300994,
      members: [
        { ref: 17130663, role: '', type: 'relation' },
        { ref: 111, role: '', type: 'node' },
      ],
      osmMeta: { id: 17130099, type: 'relation' },
      properties: {
        hasImages: true,
        histogram: [1, undefined, 1],
        parentId: 999,
        routeCount: 52,
      },
      tags: { climbing: 'area', name: 'Roviště' },
      type: 'Feature',
    },
    {
      center: [14.2572643, 49.660081250000005],
      geometry: {
        geometries: [
          { coordinates: [14.2571299, 49.6601234], type: 'Point' },
          { coordinates: [14.2573987, 49.6600391], type: 'Point' },
        ],
        type: 'GeometryCollection',
      },
      id: 171306634,
      members: [
        { ref: 12361011879, role: '', type: 'node' },
        { ref: 11580052710, role: '', type: 'node' },
      ],
      osmMeta: { id: 17130663, type: 'relation' },
      properties: {
        hasImages: true,
        histogram: [1, undefined, 1],
        parentId: 17130099,
        routeCount: 2,
      },
      tags: {
        climbing: 'crag',
        name: 'Yosemite (Hafty)',
        wikimedia_commons: 'File:Roviště - Hafty.jpg',
      },
      type: 'Feature',
    },
  ]);
});
