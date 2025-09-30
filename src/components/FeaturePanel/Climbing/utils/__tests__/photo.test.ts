import { getLastWikimediaCommonsIndex } from '../photo';
import { FeatureTags } from '../../../../../services/types';

describe('getNextWikimediaCommonsIndex', () => {
  it('should return 0 when there are no wikimedia_commons keys', () => {
    const tags: FeatureTags = {};
    expect(getLastWikimediaCommonsIndex(tags)).toBe(0);
  });

  it('should return 1 when there is one wikimedia_commons key', () => {
    const tags: FeatureTags = { wikimedia_commons: 'File:example.jpg' };
    expect(getLastWikimediaCommonsIndex(tags)).toBe(1);
  });

  it('should return the next index when there are multiple wikimedia_commons keys', () => {
    const tags: FeatureTags = {
      wikimedia_commons: 'File:example1.jpg',
      'wikimedia_commons:2': 'File:example2.jpg',
    };
    expect(getLastWikimediaCommonsIndex(tags)).toBe(2);
  });

  it('should handle non-numeric wikimedia_commons keys correctly', () => {
    const tags: FeatureTags = {
      wikimedia_commons: 'File:example1.jpg',
      'wikimedia_commons:path': 'some/path',
    };
    expect(getLastWikimediaCommonsIndex(tags)).toBe(1);
  });

  it('should handle gaps in the sequence of wikimedia_commons keys', () => {
    const tags: FeatureTags = {
      wikimedia_commons: 'File:example1.jpg',
      'wikimedia_commons:3': 'File:example3.jpg',
    };
    expect(getLastWikimediaCommonsIndex(tags)).toBe(3);
  });
});
