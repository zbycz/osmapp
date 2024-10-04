import * as fetchModule from '../../../../services/fetch';
import { requestLines } from '../requestRoutes';

jest.mock('../../../../services/fetch', () => ({
  fetchJson: jest.fn(),
}));

test('conversion', async () => {
  jest.spyOn(fetchModule, 'fetchJson').mockResolvedValue({
    elements: [
      {
        type: 'relation',
        id: 6818857,
        members: [],
        tags: {
          colour: '#880088',
          ref: '89',
          route_master: 'bus',
          type: 'route_master',
        },
      },
      {
        type: 'relation',
        id: 68352,
        bounds: {},
        members: [],
        tags: {
          ref: '89',
          route: 'bus',
          type: 'route',
        },
      },
      {
        type: 'relation',
        id: 4673219,
        bounds: {},
        members: [],
        tags: {
          ref: '89',
          route: 'bus',
          type: 'route',
        },
      },
    ],
  });

  const features = await requestLines('node', 3862767512);

  expect(features.routes).toEqual([
    {
      colour: '#880088',
      osmId: '6818857',
      osmType: 'relation',
      ref: '89',
      service: 'bus',
    },
  ]);
  expect(features.geoJson.features).toEqual([
    {
      center: undefined,
      geometry: {
        geometries: [],
        type: 'GeometryCollection',
      },
      id: 683524,
      osmMeta: {
        id: 68352,
        type: 'relation',
      },
      properties: {
        class: 'bus',
        osmappType: 'relation',
        ref: '89',
        route: 'bus',
        subclass: 'bus',
        type: 'route',
      },
      tags: {
        ref: '89',
        route: 'bus',
        type: 'route',
      },
      type: 'Feature',
    },
    {
      center: undefined,
      geometry: {
        geometries: [],
        type: 'GeometryCollection',
      },
      id: 46732194,
      osmMeta: {
        id: 4673219,
        type: 'relation',
      },
      properties: {
        class: 'bus',
        osmappType: 'relation',
        ref: '89',
        route: 'bus',
        subclass: 'bus',
        type: 'route',
      },
      tags: {
        ref: '89',
        route: 'bus',
        type: 'route',
      },
      type: 'Feature',
    },
  ]);
});
