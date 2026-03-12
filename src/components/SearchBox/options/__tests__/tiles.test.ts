import { getTilesOption } from '../tilesUtils';

describe('getTilesOption', () => {
  describe('z/x/y format', () => {
    it('parses valid tile string', () => {
      const result = getTilesOption('12/2210/1395');
      expect(result).toEqual([
        {
          type: 'tiles',
          tiles: { z: 12, x: 2210, y: 1395, label: '12/2210/1395' },
        },
      ]);
    });

    it('parses tile 0/0/0', () => {
      const result = getTilesOption('0/0/0');
      expect(result).toHaveLength(1);
      expect(result[0].tiles).toEqual({ z: 0, x: 0, y: 0, label: '0/0/0' });
    });

    it('rejects out-of-range x', () => {
      // z=1 means max x/y = 1
      expect(getTilesOption('1/2/0')).toEqual([]);
    });

    it('rejects out-of-range y', () => {
      expect(getTilesOption('1/0/2')).toEqual([]);
    });

    it('rejects non-tile strings', () => {
      expect(getTilesOption('hello')).toEqual([]);
      expect(getTilesOption('12/abc/1395')).toEqual([]);
    });
  });

  describe('URL format with z, x, y query params', () => {
    it('parses openclimbing tile URL', () => {
      const result = getTilesOption(
        'https://openclimbing.org/api/climbing-tiles/tile?z=12&x=2210&y=1395',
      );
      expect(result).toEqual([
        {
          type: 'tiles',
          tiles: { z: 12, x: 2210, y: 1395, label: '12/2210/1395' },
        },
      ]);
    });

    it('parses URL with different parameter order', () => {
      const result = getTilesOption(
        'https://example.com/tile?y=1395&z=12&x=2210',
      );
      expect(result).toEqual([
        {
          type: 'tiles',
          tiles: { z: 12, x: 2210, y: 1395, label: '12/2210/1395' },
        },
      ]);
    });

    it('rejects URL missing z parameter', () => {
      expect(getTilesOption('https://example.com/tile?x=2210&y=1395')).toEqual(
        [],
      );
    });

    it('rejects URL with non-numeric values', () => {
      expect(
        getTilesOption('https://example.com/tile?z=abc&x=2210&y=1395'),
      ).toEqual([]);
    });

    it('rejects URL with out-of-range tile coordinates', () => {
      expect(getTilesOption('https://example.com/tile?z=1&x=5&y=0')).toEqual(
        [],
      );
    });

    it('handles URL with extra parameters', () => {
      const result = getTilesOption(
        'https://example.com/tile?z=12&x=2210&y=1395&format=json',
      );
      expect(result).toEqual([
        {
          type: 'tiles',
          tiles: { z: 12, x: 2210, y: 1395, label: '12/2210/1395' },
        },
      ]);
    });

    it('handles URL with HTML-encoded ampersands', () => {
      // The browser/input typically decodes &amp; to & before we get it,
      // but if pasted raw, URL constructor handles it
      const result = getTilesOption(
        'https://example.com/tile?z=12&x=2210&y=1395',
      );
      expect(result).toHaveLength(1);
    });
  });
});
