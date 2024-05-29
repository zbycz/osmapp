import { Feature } from '../../../../services/types';

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

export const getFeaturePhotoKeys = (feature: Feature) =>
  Object.keys(feature.tags).filter((k) => k.startsWith('wikimedia_commons'));

export const getFeaturePhotos = (feature: Feature) =>
  getFeaturePhotoKeys(feature).map((key) =>
    sanitizeWikimediaCommonsPhotoName(feature.tags[key]),
  );
