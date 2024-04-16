import { cragsToGeojson } from '../fetchCrags';

/*
[out:json][timeout:25];
    (
      nwr["climbing"](49.65296,14.25032,49.65524,14.25448);
    );
    (
      ._;
      rel(br);
    );
    out center qt;
*/
const routeNode = {
  type: 'node',
  id: 11557711620,
  lat: 49.65,
  lon: 14.25,
  tags: { climbing: 'route_bottom', name: 'Detonátor' },
};
const anotherNode = {
  type: 'node',
  id: 123,
  lat: 55,
  lon: 10,
  tags: { climbing: 'crag', 'climbing:sport': '30' },
};
const areaRelation = {
  type: 'relation',
  id: 555,
  members: [
    { type: 'relation', ref: 17089246, role: '' },
    { type: 'node', ref: 123, role: '' },
  ],
  tags: { climbing: 'area', name: 'Lomy nad Velkou' },
};
const someWay = {
  type: 'way',
  id: 222,
  nodes: [11557711620, 123],
  tags: {},
};
const cragRelation = {
  type: 'relation',
  id: 17089246,
  center: { lat: 49.6540645, lon: 14.2524021 },
  members: [{ type: 'node', ref: 11557711620, role: '' }],
  tags: { climbing: 'crag', name: 'Borová věž' },
};
const response = {
  elements: [routeNode, anotherNode, someWay, areaRelation, cragRelation],
};

const geojson = [
  {
    center: [14.25, 49.65],
    geometry: { coordinates: [14.25, 49.65], type: 'Point' },
    id: 115577116200,
    osmMeta: { id: 11557711620, type: 'node' },
    properties: {
      class: 'climbing',
      subclass: 'route_bottom',
      climbing: 'route_bottom',
      name: 'Detonátor',
      osmappLabel: 'Detonátor',
      osmappType: 'node',
    },
    tags: { climbing: 'route_bottom', name: 'Detonátor' },
    type: 'Feature',
  },
  {
    center: [10, 55],
    geometry: { coordinates: [10, 55], type: 'Point' },
    id: 1230,
    osmMeta: { id: 123, type: 'node' },
    properties: {
      class: 'climbing',
      climbing: 'crag',
      'climbing:sport': '30',
      osmappRouteCount: 30,
      osmappType: 'node',
      subclass: 'crag',
      osmappLabel: '³⁰',
    },
    tags: {
      climbing: 'crag',
      'climbing:sport': '30',
    },
    type: 'Feature',
  },
  {
    center: [12.125, 52.325],
    geometry: {
      coordinates: [
        [14.25, 49.65],
        [10, 55],
      ],
      type: 'LineString',
    },
    id: 2221,
    osmMeta: { id: 222, type: 'way' },
    properties: { class: 'information', osmappType: 'way', osmappLabel: '' },
    tags: {},
    type: 'Feature',
  },
  {
    center: [12.125, 52.325], // center of routeNode and anotherNode
    geometry: {
      geometries: [
        {
          geometries: [{ coordinates: [14.25, 49.65], type: 'Point' }],
          type: 'GeometryCollection',
        },
        { type: 'Point', coordinates: [10, 55] },
      ],
      type: 'GeometryCollection',
    },
    id: 5554,
    osmMeta: { id: 555, type: 'relation' },
    properties: {
      class: 'climbing',
      subclass: 'area',
      climbing: 'area',
      name: 'Lomy nad Velkou',
      osmappLabel: 'Lomy nad Velkou\n³¹',
      osmappType: 'relation',
      osmappRouteCount: 31,
    },
    tags: { climbing: 'area', name: 'Lomy nad Velkou' },
    type: 'Feature',
    members: [
      { type: 'relation', ref: 17089246, role: '' },
      { type: 'node', ref: 123, role: '' },
    ],
  },
  {
    center: [14.25, 49.65],
    geometry: {
      geometries: [{ coordinates: [14.25, 49.65], type: 'Point' }],
      type: 'GeometryCollection',
    },
    id: 170892464,
    osmMeta: { id: 17089246, type: 'relation' },
    properties: {
      class: 'climbing',
      subclass: 'crag',
      climbing: 'crag',
      name: 'Borová věž',
      osmappLabel: 'Borová věž\n¹',
      osmappType: 'relation',
      osmappRouteCount: 1,
    },
    tags: { climbing: 'crag', name: 'Borová věž' },
    type: 'Feature',
    members: [{ type: 'node', ref: 11557711620, role: '' }],
  },
];

test('basic conversion', () => {
  expect(cragsToGeojson(response)).toEqual(geojson);
});

const area2 = {
  type: 'relation',
  id: 555,
  members: [{ type: 'relation', ref: 17089246, role: '' }],
  tags: {},
};
const crag2 = {
  type: 'relation',
  id: 17089246,
  center: { lat: 51, lon: 14 },
  members: [],
  tags: {},
};
test('conversion with centers instead of geometries', () => {
  expect(cragsToGeojson({ elements: [area2, crag2] })).toEqual([
    {
      type: 'Feature',
      osmMeta: { id: 555, type: 'relation' },
      id: 5554,
      center: [14, 51],
      geometry: {
        geometries: [{ coordinates: [14, 51], type: 'Point' }],
        type: 'GeometryCollection',
      },
      properties: {
        class: 'information',
        osmappType: 'relation',
        osmappLabel: '',
      },
      tags: {},
      members: [{ type: 'relation', ref: 17089246, role: '' }],
    },
    {
      type: 'Feature',
      osmMeta: { id: 17089246, type: 'relation' },
      id: 170892464,
      center: [14, 51],
      geometry: { coordinates: [14, 51], type: 'Point' },
      properties: {
        class: 'information',
        osmappType: 'relation',
        osmappLabel: '',
      },
      tags: {},
      members: [],
    },
  ]);
});
