import { fetchFeature } from '../osmApi';
import * as helpers from '../../components/helpers';
import * as fetch from '../fetch';
import {
  node,
  nodeFeature,
  relation,
  relationFeature,
  way,
  wayFeature,
} from './osmApi.fixture';

const osm = (item) => ({ elements: [item] });
const overpass = {
  elements: [{ center: { lat: 50, lon: 14 } }],
};

describe('fetchFeature', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  const isServer = jest.spyOn(helpers, 'isServer').mockReturnValue(true);

  it('should work for node', async () => {
    const fetchJson = jest
      .spyOn(fetch, 'fetchJson')
      .mockResolvedValue(osm(node));

    const feature = await fetchFeature('n123');
    expect(fetchJson).toHaveBeenCalledTimes(1);
    expect(feature).toEqual(nodeFeature);
  });

  it('should work for way', async () => {
    const fetchJson = jest
      .spyOn(fetch, 'fetchJson')
      .mockImplementation((url) =>
        Promise.resolve(url.match(/overpass/) ? overpass : osm(way)),
      );

    const feature = await fetchFeature('w51050330');
    expect(fetchJson).toHaveBeenCalledTimes(2);
    expect(feature).toEqual(wayFeature);
  });

  it('should work for relation', async () => {
    const fetchJson = jest
      .spyOn(fetch, 'fetchJson')
      .mockImplementation((url) =>
        Promise.resolve(url.match(/overpass/) ? overpass : osm(relation)),
      );

    const feature = await fetchFeature('r1234');
    expect(fetchJson).toHaveBeenCalledTimes(2);
    expect(feature).toEqual(relationFeature);
  });

  it('should not return center for a way in BROWSER', async () => {
    isServer.mockReturnValue(false);
    const fetchJson = jest
      .spyOn(fetch, 'fetchJson')
      .mockImplementation((url) =>
        Promise.resolve(url.match(/overpass/) ? overpass : osm(way)),
      );

    const feature = await fetchFeature('w51050330');
    expect(fetchJson).toHaveBeenCalledTimes(1);
    expect(feature).toEqual({ ...wayFeature, center: undefined });
  });
});
