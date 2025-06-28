import { computeTiles } from '../computeTiles';
import { LngLat } from 'maplibre-gl';

describe('computeTiles', () => {
  it('should correctly compute tiles for a given zoom level and bounding box', () => {
    // map bounds: '-137.03852', '85.05113', '126.13032', '-45.05821'
    // gives:
    const northWest = { lng: -180, lat: 90 } as LngLat;
    const southEast = { lng: 180, lat: -23.081054434821873 } as LngLat;

    const result = computeTiles(0, northWest, southEast);
    const asString = result.map(({ z, x, y }) => `${z}/${x}/${y}`);
    expect(asString).toEqual(['0/0/0']);
  });
});
