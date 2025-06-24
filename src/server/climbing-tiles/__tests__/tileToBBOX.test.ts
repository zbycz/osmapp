import { tileToBBOX } from '../tileToBBOX';
import { Tile } from '../../../types';

describe('tileToBBOX', () => {
  // -180      180
  // +-----------+ 85
  // |           |
  // +-----------+ -85
  it('should return correct BBox for tile 0/0/0', () => {
    const tile: Tile = { z: 0, x: 0, y: 0 };
    const bbox = tileToBBOX(tile);
    expect(bbox[0]).toBe(-180);
    expect(bbox[1]).toBeCloseTo(-85.0511, 3);
    expect(bbox[2]).toBe(180);
    expect(bbox[3]).toBeCloseTo(85.0511, 3);
  });

  // +-----+
  // | X   |
  // |     |
  // +-----+
  it('should return correct BBox for tile 1/0/0', () => {
    const tile: Tile = { z: 1, x: 0, y: 0 };
    const bbox = tileToBBOX(tile);
    expect(bbox[0]).toBe(-180);
    expect(bbox[1]).toBe(0);
    expect(bbox[2]).toBe(0);
    expect(bbox[3]).toBeCloseTo(85.0511, 3);
  });

  // +-----+
  // |     |
  // |   X |
  // +-----+
  it('should return correct BBox for tile 1/1/1', () => {
    const tile: Tile = { z: 1, x: 1, y: 1 };
    const bbox = tileToBBOX(tile);
    expect(bbox[0]).toBe(0);
    expect(bbox[1]).toBeCloseTo(-85.0511, 3);
    expect(bbox[2]).toBe(180);
    expect(bbox[3]).toBe(0);
  });
});
