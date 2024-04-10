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
  tags: {},
};
const areaRelation = {
  type: 'relation',
  id: 17142287,
  members: [
    { type: 'relation', ref: 17089246, role: '' },
    { type: 'node', role: '' },
  ],
  tags: { climbing: 'area', name: 'Lomy nad Velkou' },
};
const cragRelation = {
  type: 'relation',
  id: 17089246,
  center: { lat: 49.6540645, lon: 14.2524021 },
  members: [{ type: 'node', ref: 11557711620, role: '' }],
  tags: { climbing: 'crag', name: 'Borová věž' },
};
const response = {
  elements: [routeNode, anotherNode, areaRelation, cragRelation],
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
    properties: { class: 'information', osmappType: 'node' },
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
    id: 171422874,
    osmMeta: { id: 17142287, type: 'relation' },
    properties: {
      class: 'climbing',
      subclass: 'area',
      climbing: 'area',
      name: 'Lomy nad Velkou',
      osmappType: 'relation',
    },
    tags: { climbing: 'area', name: 'Lomy nad Velkou' },
    type: 'Feature',
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
      osmappType: 'relation',
    },
    tags: { climbing: 'crag', name: 'Borová věž' },
    type: 'Feature',
  },
];

test('conversion', () => {
  expect(cragsToGeojson(response)).toEqual(geojson);
});
