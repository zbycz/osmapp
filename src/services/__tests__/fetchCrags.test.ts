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
const response = {
  elements: [
    {
      type: 'node',
      id: 11557711620,
      lat: 49.6541269,
      lon: 14.2523716,
      tags: {
        climbing: 'route_bottom',
        'climbing:grade:uiaa': '5',
        name: 'Detonátor',
        sport: 'climbing',
        wikimedia_commons: 'File:Lomy nad Velkou - Borová věž.jpg',
        'wikimedia_commons:2': 'File:Lomy nad Velkou - Borová věž3.jpg',
        'wikimedia_commons:2:path':
          '0.924,0.797|0.773,0.428B|0.708,0.307B|0.636,0.174B|0.581,0.086B|0.562,0.056A',
        'wikimedia_commons:3': 'File:Lomy nad Velkou - Borová věž4.jpg',
        'wikimedia_commons:3:path': '0.933,0.757|0.729,0.286|0.637,0.136',
        'wikimedia_commons:path':
          '0.32,0.902|0.371,0.537B|0.372,0.433B|0.388,0.298B|0.4,0.206B|0.406,0.173A',
      },
    },
    {
      type: 'relation',
      id: 17142287,
      members: [
        {
          type: 'relation',
          ref: 17089246,
          role: '',
        },
      ],
      tags: {
        climbing: 'area',
        name: 'Lomy nad Velkou',
        site: 'climbing',
        type: 'site',
      },
    },
    {
      type: 'relation',
      id: 17089246,
      center: {
        lat: 49.6540645,
        lon: 14.2524021,
      },
      members: [
        {
          type: 'node',
          ref: 11557711620,
          role: '',
        },
      ],
      tags: {
        climbing: 'crag',
        name: 'Borová věž',
        site: 'climbing',
        sport: 'climbing',
        type: 'site',
      },
    },
  ],
};

const geojson = [];

test('conversion', () => {
  expect(cragsToGeojson(response)).toEqual(geojson);
});
