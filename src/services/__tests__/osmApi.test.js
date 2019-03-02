// @flow

import { osmToGeojson } from '../osmApi';
import { node, way } from './fixture';

describe('osmToGeojson()', () => {
  it('should convert node', async () => {
    const geojson = await osmToGeojson(node.xml);
    expect(geojson).toEqual(node.geojson);
  });

  it('should convert way', async () => {
    const geojson = await osmToGeojson(way.xml);
    expect(geojson).toEqual(way.geojson);
  });
});
