import { overpassAroundToSkeletons } from '../overpass/overpassAroundToSkeletons';

/*
[timeout:10][out:json];
(node(around:15,50.09336,14.29095);way(around:15,50.09336,14.29095););
out tags geom(50.09176,14.29022,50.09482,14.29359);

relation(around:15,50.09336,14.29095);
out geom(50.09176,14.29022,50.09482,14.29359);
*/

const response = {
  version: 0.6,
  generator: 'Overpass API 0.7.56.9 76e5016d',
  osm3s: {
    timestamp_osm_base: '2021-04-10T14:11:25Z',
    copyright:
      'The data included in this document is from www.openstreetmap.org. The data is made available under ODbL.',
  },
  elements: [
    {
      type: 'node',
      id: 4732783521,
      lat: 50.0934005,
      lon: 14.2909859,
    },
    {
      type: 'node',
      id: 8334206933,
      lat: 50.0933537,
      lon: 14.2909539,
      tags: {
        crossing: 'marked',
        highway: 'crossing',
      },
    },
    {
      type: 'way',
      id: 480276447,
      bounds: {
        minlat: 50.0933456,
        minlon: 14.2909859,
        maxlat: 50.0934572,
        maxlon: 14.291471,
      },
      geometry: [
        { lat: 50.0934005, lon: 14.2909859 },
        { lat: 50.0933456, lon: 14.291002 },
        { lat: 50.0933967, lon: 14.2914251 },
      ],
      tags: {
        building: 'roof',
        height: '18',
        layer: '3',
      },
    },
    {
      type: 'relation',
      id: 12205228,
      bounds: {
        minlat: 50.0924563,
        minlon: 14.2901549,
        maxlat: 50.0941783,
        maxlon: 14.2919642,
      },
      members: [
        {
          type: 'way',
          ref: 896562593,
          role: 'outer',
          geometry: [
            { lat: 50.0937702, lon: 14.2901549 },
            { lat: 50.0938094, lon: 14.2904676 },
          ],
        },
        {
          type: 'way',
          ref: 480276444,
          role: 'inner',
          geometry: [
            { lat: 50.0930325, lon: 14.2904371 },
            { lat: 50.092933, lon: 14.2904659 },
            { lat: 50.0929614, lon: 14.290703 },
          ],
        },
      ],
      tags: {
        amenity: 'parking',
        layer: '2',
        type: 'multipolygon',
      },
    },
  ],
};

const skeletons = [
  {
    center: [14.2909859, 50.0934005],
    geometry: {
      coordinates: [14.2909859, 50.0934005],
      type: 'Point',
    },
    osmMeta: {
      id: 4732783521,
      type: 'node',
    },
    properties: {
      class: 'information',
    },
    tags: {},
    type: 'Feature',
  },
  {
    center: [14.2909539, 50.0933537],
    geometry: {
      coordinates: [14.2909539, 50.0933537],
      type: 'Point',
    },
    osmMeta: {
      id: 8334206933,
      type: 'node',
    },
    properties: {
      class: 'information',
      subclass: 'crossing',
    },
    tags: {
      crossing: 'marked',
      highway: 'crossing',
    },
    type: 'Feature',
  },
  {
    center: [14.2912055, 50.09337305],
    geometry: {
      coordinates: [
        [14.2909859, 50.0934005],
        [14.291002, 50.0933456],
        [14.2914251, 50.0933967],
      ],
      type: 'LineString',
    },
    osmMeta: {
      id: 480276447,
      type: 'way',
    },
    properties: {
      class: 'building',
      subclass: 'roof',
    },
    tags: {
      building: 'roof',
      height: '18',
      layer: '3',
    },
    type: 'Feature',
  },
  {
    center: [14.290311249999998, 50.093789799999996],
    geometry: {
      coordinates: [
        [14.2901549, 50.0937702],
        [14.2904676, 50.0938094],
      ],
      type: 'LineString',
    },
    osmMeta: {
      id: 12205228,
      type: 'relation',
    },
    properties: {
      class: 'parking',
      subclass: 'parking',
    },
    tags: {
      amenity: 'parking',
      layer: '2',
      type: 'multipolygon',
    },
    type: 'Feature',
  },
];

test('conversion', () => {
  expect(overpassAroundToSkeletons(response)).toEqual(skeletons);
});
