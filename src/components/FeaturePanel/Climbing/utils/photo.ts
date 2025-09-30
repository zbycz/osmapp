import { FeatureTags } from '../../../../services/types';
import { isIOS } from '../../../../helpers/platforms';
import { naturalSort } from './array';

// @TODO move file outside of climbing

export const getWikimediaCommonsKey = (index: number) =>
  `wikimedia_commons${index === 0 ? '' : `:${index + 1}`}`;

export const addFilePrefix = (name: string) => `File:${name}`;

export const removeFilePrefix = (name: string) => name?.replace(/^File:/, '');

export const isWikimediaCommons = (tag: string) =>
  tag.startsWith('wikimedia_commons');

export const hasWikimediaCommons = (tags: FeatureTags) =>
  Object.keys(tags).some((tag) => isWikimediaCommons(tag));

export const isWikimediaCommonsPhoto = ([key, value]: [string, string]) => {
  // regexp to match wikimedia_commons, wikimedia_commons:2, etc. but not  wikimedia_commons:path, wikimedia_commons:whatever
  const re = /^wikimedia_commons(:\d+)?$/;
  return re.test(key) && value.startsWith('File:');
};

export const getWikimediaCommonsPhotoTags = (tags: FeatureTags) => {
  return naturalSort(
    Object.entries(tags).filter(isWikimediaCommonsPhoto),
    (item) => item[0],
  );
};
export const getWikimediaCommonsPhotoTagsObject = (tags: FeatureTags) => {
  return getWikimediaCommonsPhotoTags(tags).reduce(
    (acc, [tagKey, tagValue]) => ({ ...acc, [tagKey]: tagValue }),
    {},
  );
};

export const getWikimediaCommonsPhotoKeys = (tags: FeatureTags) =>
  getWikimediaCommonsPhotoTags(tags).map(([tagKey, _tagValue]) => tagKey);

export const getWikimediaCommonsPhotoValues = (tags: FeatureTags) =>
  getWikimediaCommonsPhotoTags(tags).map(([_tagKey, tagValue]) => tagValue);

export const isWikimediaCommonsPhotoPath = (tag: string) => {
  const re = /^wikimedia_commons(:\d+)*:path$/;
  return re.test(tag);
};

export const getWikimediaCommonsPhotoPathKeys = (tags: FeatureTags) =>
  Object.keys(tags).filter(isWikimediaCommonsPhotoPath);

export const getCommonTags = (tags: FeatureTags, commonTag: string) => {
  return naturalSort(
    Object.entries(tags).filter(([key]) => {
      return key.startsWith(commonTag);
    }),
    (item) => item[0],
  );
};

export const getCommonKeys = (tags: FeatureTags, commonKey: string) =>
  getCommonTags(tags, commonKey).map(([tagKey, _tagValue]) => tagKey); // TODO this returns also :path keys, not sure if intended

export const getLastWikimediaCommonsIndex = (tags: FeatureTags) => {
  return getLastCommonKeyIndex(tags, 'wikimedia_commons');
};

export const getLastCommonKeyIndex = (tags: FeatureTags, commonKey: string) => {
  const keys = getCommonKeys(tags, commonKey);

  const maxKey = keys.reduce((max, key) => {
    if (key === commonKey) return Math.max(max, 0);

    const parts = key.split(':');
    if (parts[0] === commonKey && parts.length > 1) {
      const number = parseInt(parts[1], 10);
      if (!Number.isNaN(number)) {
        return Math.max(max, number - 1);
      }
    }
    return max;
  }, -1 /* so it will be 0 for the first tag*/);

  return maxKey + 1;
};

const getHighestCachedResolution = ({ loadedPhotos, photoPath }) => {
  if (!loadedPhotos || !loadedPhotos?.[photoPath]) return null;

  return Object.keys(loadedPhotos[photoPath])
    .map((key) => Number(key))
    .reduce<number | null>((maxResolution, resolution) => {
      const isLoaded = loadedPhotos[photoPath][resolution];
      if (!maxResolution || (resolution > maxResolution && isLoaded)) {
        return resolution;
      }
      return maxResolution;
    }, null);
};

const getResolutionAccordingZoom = ({ windowDimensions, photoZoom }) => {
  const retinaMultiplier = isIOS() ? 2 : 1;
  const AVERAGE_IMAGE_PERCENTAGE_FILL = 0.7;
  const ROUND_SIZES_TO = 200;
  const MEDIUM_ZOOM_MULTIPLIER = 2.5;
  const LARGE_ZOOM_MULTIPLIER = 4;

  const width =
    Math.ceil(
      (windowDimensions.width * AVERAGE_IMAGE_PERCENTAGE_FILL) / ROUND_SIZES_TO,
    ) *
    ROUND_SIZES_TO *
    retinaMultiplier;

  if (photoZoom.scale >= 4.5) return width * LARGE_ZOOM_MULTIPLIER;
  if (photoZoom.scale > 2.3) return width * MEDIUM_ZOOM_MULTIPLIER;
  return width;
};

export const getResolution = ({
  windowDimensions,
  photoPath,
  photoZoom,
  loadedPhotos,
}) => {
  const newResolution = getResolutionAccordingZoom({
    windowDimensions,
    photoZoom,
  });

  const highestCachedResolution = getHighestCachedResolution({
    loadedPhotos,
    photoPath,
  });
  if (
    highestCachedResolution !== null &&
    newResolution < highestCachedResolution
  ) {
    return highestCachedResolution;
  }

  return newResolution;
};
