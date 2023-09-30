import { osmJsonToSkeletons } from '../overpassSearch';

/*
[out:json][timeout:25];
  (
    node["type"="route"]["route"="bus"](49.93841,14.28715,49.97035,14.34812);
    way["type"="route"]["route"="bus"](49.93841,14.28715,49.97035,14.34812);
    relation["type"="route"]["route"="bus"](49.93841,14.28715,49.97035,14.34812);
  );
  out body geom;
*/

const response = {
  version: 0.6,
  generator: 'Overpass API 0.7.61.5 4133829e',
  osm3s: {
    timestamp_osm_base: '2023-09-28T10:25:11Z',
    copyright:
      'The data included in this document is from www.openstreetmap.org. The data is made available under ODbL.',
  },
  elements: [
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
          type: 'node',
          ref: 4303193147,
          role: 'platform',
          lat: 49.9560895,
          lon: 14.3420546,
        },
        {
          type: 'node',
          ref: 5650107055,
          role: 'platform',
          lat: 49.95976,
          lon: 14.35261,
        },
        {
          type: 'way',
          ref: 143079042,
          role: '',
          geometry: [
            { lat: 49.9510996, lon: 14.3406283 },
            { lat: 49.9512392, lon: 14.340966 },
            { lat: 49.9512882, lon: 14.3409961 },
          ],
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
          type: 'way',
          ref: 143079039,
          role: '',
          geometry: [
            { lat: 49.9512723, lon: 14.3405453 },
            { lat: 49.9512769, lon: 14.3403348 },
            { lat: 49.9512638, lon: 14.3402265 },
            { lat: 49.9512376, lon: 14.3399046 },
            { lat: 49.9512538, lon: 14.3397224 },
            { lat: 49.9513307, lon: 14.3396011 },
            { lat: 49.9514674, lon: 14.339525 },
            { lat: 49.9516502, lon: 14.3394962 },
            { lat: 49.9519514, lon: 14.3395323 },
            { lat: 49.9524812, lon: 14.3397353 },
            { lat: 49.9528361, lon: 14.3398737 },
            { lat: 49.9529293, lon: 14.3399175 },
            { lat: 49.9533275, lon: 14.3401047 },
            { lat: 49.9536045, lon: 14.3402959 },
            { lat: 49.9543101, lon: 14.340794 },
            { lat: 49.9555376, lon: 14.3415765 },
            { lat: 49.9564591, lon: 14.3422582 },
            { lat: 49.9569866, lon: 14.3425944 },
            { lat: 49.9574162, lon: 14.3429583 },
            { lat: 49.9576284, lon: 14.3431366 },
            { lat: 49.9578467, lon: 14.3434496 },
            { lat: 49.9582484, lon: 14.3441399 },
            { lat: 49.9588316, lon: 14.3454072 },
            { lat: 49.9589787, lon: 14.3459137 },
            { lat: 49.9590815, lon: 14.3465416 },
          ],
        },
        {
          type: 'way',
          ref: 538959927,
          role: '',
          geometry: [
            { lat: 49.9590815, lon: 14.3465416 },
            { lat: 49.9596598, lon: 14.3496964 },
            { lat: 49.9598834, lon: 14.3509159 },
            { lat: 49.959959, lon: 14.3513285 },
            { lat: 49.9600528, lon: 14.3518402 },
            { lat: 49.9600898, lon: 14.3520419 },
            { lat: 49.9602015, lon: 14.3522125 },
          ],
        },
        {
          type: 'way',
          ref: 311389592,
          role: '',
          geometry: [
            { lat: 49.9598062, lon: 14.3530042 },
            { lat: 49.9598857, lon: 14.3529381 },
            { lat: 49.9599703, lon: 14.3528484 },
            { lat: 49.9600301, lon: 14.3527557 },
            { lat: 49.9600872, lon: 14.3526668 },
            { lat: 49.9601506, lon: 14.3525137 },
            { lat: 49.9602015, lon: 14.3522125 },
          ],
        },
        {
          type: 'way',
          ref: 166349501,
          role: '',
          geometry: [
            { lat: 49.9598062, lon: 14.3530042 },
            { lat: 49.9597388, lon: 14.3526991 },
            { lat: 49.9596846, lon: 14.3526796 },
            { lat: 49.9595677, lon: 14.3527257 },
          ],
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

const skeletons = [
  {
    geometry: {
      type: 'LineString',
    },
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
  expect(osmJsonToSkeletons(response)).toEqual(skeletons);
});
