import { Feature, FeatureTags } from '../../../../services/types';

// @TODO move file outside of climbing

export const WIKIMEDIA_COMMONS = 'wikimedia_commons';

export const getPhotoKey = (photoIndex: number, offset: number = 0) => {
  const photoIndexWithOffset = photoIndex + offset;
  return `${WIKIMEDIA_COMMONS}${
    photoIndexWithOffset === 1 ? '' : `:${photoIndexWithOffset}`
  }`;
};

export const sanitizeWikimediaCommonsPhotoName = (
  name: string,
  isHumanReadable: boolean = false,
) => {
  const withoutFile = name?.replace(/^File:/, '');
  if (isHumanReadable) {
    return withoutFile.replace(/ /g, '_');
  }
  return withoutFile;
};

export const isPhotoTag = (tag: string) => tag.startsWith('wikimedia_commons');

export const getPhotoKeysFromTags = (tags: FeatureTags) =>
  Object.keys(tags).filter((k) => isPhotoTag(k));

export const getFeaturePhotoKeys = (feature: Feature) =>
  getPhotoKeysFromTags(feature.tags);

export const getFeaturePhotos = (feature: Feature) =>
  getFeaturePhotoKeys(feature).map((key) =>
    sanitizeWikimediaCommonsPhotoName(feature.tags[key]),
  );

export const getNewPhotoIndex = (photoKeys: Array<string>) => {
  const maxKey = photoKeys.reduce((max, item) => {
    if (item === WIKIMEDIA_COMMONS) return Math.max(max, 1);

    const parts = item.split(':');
    if (parts[0] === WIKIMEDIA_COMMONS && parts.length > 1) {
      const number = parseInt(parts[1], 10);
      if (!Number.isNaN(number)) {
        return Math.max(max, number);
      }
    }
    return max;
  }, 0);

  return maxKey + 1;
};
