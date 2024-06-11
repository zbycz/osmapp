import { Feature, FeatureTags } from '../../../../services/types';

// @TODO move file outside of climbing

export const getWikimediaCommonsKey = (index: number) =>
  `wikimedia_commons${index === 1 ? '' : `:${index}`}`;

export const removeFilePrefix = (name: string) => name?.replace(/^File:/, '');

export const isWikimediaCommons = (tag: string) =>
  tag.startsWith('wikimedia_commons');

export const getWikimediaCommonsKeys = (tags: FeatureTags) =>
  Object.keys(tags).filter(isWikimediaCommons); // TODO this returns also :path keys, not sure if intended

export const getNewWikimediaCommonsIndex = (feature: Feature) => {
  const keys = getWikimediaCommonsKeys(feature.tags);

  const maxKey = keys.reduce((max, key) => {
    if (key === 'wikimedia_commons') return Math.max(max, 1);

    const parts = key.split(':');
    if (parts[0] === 'wikimedia_commons' && parts.length > 1) {
      const number = parseInt(parts[1], 10);
      if (!Number.isNaN(number)) {
        return Math.max(max, number);
      }
    }
    return max;
  }, 0);

  return maxKey + 1;
};
