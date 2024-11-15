import { overpassGeomToGeojson, OverpassResponse } from '../overpassSearch';

/*
[out:json][timeout:25];
  (
    node["type"="route"]["route"="bus"](49.93841,14.28715,49.97035,14.34812);
    way["type"="route"]["route"="bus"](49.93841,14.28715,49.97035,14.34812);
    relation["type"="route"]["route"="bus"](49.93841,14.28715,49.97035,14.34812);
  );
  out body geom;
*/

const response: OverpassResponse = {
  elements: [
    {
      type: 'node',
      id: 761541677,
      lat: 49.9594996,
      lon: 14.3231551,
      tags: {
        highway: 'crossing',
        crossing: 'marked',
      },
    },
    {
      type: 'way',
      id: 11005021,
      bounds: {
        minlat: 49.9414065,
        minlon: 14.2801555,
        maxlat: 49.944281,
        maxlon: 14.2929424,
      },
      nodes: [73359754, 9441919612, 97951778],
      geometry: [
        { lat: 49.9414065, lon: 14.2929424 },
        { lat: 49.942755, lon: 14.2892883 },
        { lat: 49.944281, lon: 14.2801555 },
      ],
      tags: {
        highway: 'track',
        tracktype: 'grade3',
      },
    },
    {
      type: 'relation',
      id: 8337908,
      bounds: {
        minlat: 49.9510996,
        minlon: 14.3394962,
        maxlat: 49.9602015,
        maxlon: 14.3530042,
      },
      members: [
        {
          type: 'node',
          ref: 4303193142,
          role: 'platform',
          lat: 49.9511921,
          lon: 14.3409309,
        },
        {
          type: 'way',
          ref: 431070311,
          role: '',
          geometry: [
            { lat: 49.9512882, lon: 14.3409961 },
            { lat: 49.9513048, lon: 14.3408764 },
            { lat: 49.9512958, lon: 14.3406756 },
            { lat: 49.9512723, lon: 14.3405453 },
          ],
        },
        {
          type: 'relation',
          ref: 388266,
          role: 'subarea',
        },
      ],
      tags: {
        from: 'Kazín',
        name: '243: Kazín ⇒ Lipence',
        network: 'PID',
        operator: 'cz:DPP',
        'public_transport:version': '2',
        ref: '243',
        route: 'bus',
        source: 'survey',
        to: 'Lipence',
        type: 'route',
        website: 'https://pid.cz/linka/243',
      },
    },
  ],
};

const geojson = [
  {
    center: [14.3231551, 49.9594996],
    geometry: {
      coordinates: [14.3231551, 49.9594996],
      type: 'Point',
    },
    id: 7615416770,
    osmMeta: {
      id: 761541677,
      type: 'node',
    },
    properties: {
      class: 'information',
      crossing: 'marked',
      highway: 'crossing',
      osmappType: 'node',
      subclass: 'crossing',
    },
    tags: {
      crossing: 'marked',
      highway: 'crossing',
    },
    type: 'Feature',
  },
  {
    center: [14.28654895, 49.942843749999994],
    geometry: {
      coordinates: [
        [14.2929424, 49.9414065],
        [14.2892883, 49.942755],
        [14.2801555, 49.944281],
      ],
      type: 'LineString',
    },
    id: 110050211,
    osmMeta: {
      id: 11005021,
      type: 'way',
    },
    properties: {
      class: 'information',
      highway: 'track',
      osmappType: 'way',
      subclass: 'track',
      tracktype: 'grade3',
    },
    tags: {
      highway: 'track',
      tracktype: 'grade3',
    },
    type: 'Feature',
  },
  {
    center: [14.3407707, 49.95124845],
    geometry: {
      geometries: [
        {
          coordinates: [14.3409309, 49.9511921],
          type: 'Point',
        },
        {
          coordinates: [
            [14.3409961, 49.9512882],
            [14.3408764, 49.9513048],
            [14.3406756, 49.9512958],
            [14.3405453, 49.9512723],
          ],
          type: 'LineString',
        },
      ],
      type: 'GeometryCollection',
    },
    id: 83379084,
    osmMeta: {
      id: 8337908,
      type: 'relation',
    },
    properties: {
      class: 'bus',
      from: 'Kazín',
      name: '243: Kazín ⇒ Lipence',
      network: 'PID',
      operator: 'cz:DPP',
      osmappType: 'relation',
      'public_transport:version': '2',
      ref: '243',
      route: 'bus',
      source: 'survey',
      subclass: 'bus',
      to: 'Lipence',
      type: 'route',
      website: 'https://pid.cz/linka/243',
    },
    tags: {
      from: 'Kazín',
      name: '243: Kazín ⇒ Lipence',
      network: 'PID',
      operator: 'cz:DPP',
      'public_transport:version': '2',
      ref: '243',
      route: 'bus',
      source: 'survey',
      to: 'Lipence',
      type: 'route',
      website: 'https://pid.cz/linka/243',
    },
    type: 'Feature',
  },
];

test('conversion', () => {
  expect(overpassGeomToGeojson(response)).toEqual(geojson);
});
