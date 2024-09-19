import * as fetchModule from '../../../../services/fetch';
import { requestLines } from '../requestRoutes';

jest.mock('../../../../services/fetch', () => ({
  fetchJson: jest.fn(),
}));

test('conversion', async () => {
  jest.spyOn(fetchModule, 'fetchJson').mockResolvedValue({
    version: 0.6,
    generator: 'Overpass API 0.7.62.1 084b4234',
    osm3s: {
      timestamp_osm_base: '2024-09-19T11:02:24Z',
      copyright:
        'The data included in this document is from www.openstreetmap.org. The data is made available under ODbL.',
    },
    elements: [
      {
        type: 'relation',
        id: 1871120,
        members: [
          { type: 'relation', ref: 945619, role: '' },
          { type: 'relation', ref: 6090, role: '' },
        ],
        tags: {
          ref: '16',
          colour: 'red',
        },
      },
    ],
  });

  const features = await requestLines('node', 3862767512);

  expect(features.routes).toEqual([
    {
      ref: '16',
      colour: 'red',
      service: undefined,
      osmId: '1871120',
      osmType: 'relation',
    },
  ]);
  expect(features.geoJson.features).toEqual([
    {
      type: 'Feature',
      id: 18711204,
      osmMeta: { type: 'relation', id: 1871120 },
      tags: {
        colour: 'red',
        ref: '16',
      },
      properties: {
        class: 'information',
        colour: 'red',
        osmappType: 'relation',
        ref: '16',
        subclass: undefined,
      },
      geometry: {
        geometries: [],
        type: 'GeometryCollection',
      },
      center: undefined,
    },
  ]);
});
