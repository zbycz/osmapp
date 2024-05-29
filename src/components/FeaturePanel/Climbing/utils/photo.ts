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

export const getCragPhotoKeys = (feature: Feature) =>
  Object.keys(feature.tags).filter((k) => k.startsWith('wikimedia_commons'));

export const getCragPhotos = (feature: Feature) =>
  getCragPhotoKeys(feature).map((key) =>
    sanitizeWikimediaCommonsPhotoName(feature.tags[key]),
  );
