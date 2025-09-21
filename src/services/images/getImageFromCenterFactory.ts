import { intl, t } from '../intl';
import { LonLat } from '../types';
import { ImageType } from './getImageDefs';

export const getBearing = ([aX, aY]: LonLat, [bX, bY]: LonLat): number => {
  const angle = (Math.atan2(bX - aX, bY - aY) * 180) / Math.PI;
  return angle < 0 ? angle + 360 : angle;
};

const subtractAngle = (a: number, b: number): number =>
  Math.min(Math.abs(a - b), a - b + 360);

type ImageProvider<T> = {
  getImages: (pos: LonLat) => Promise<T[]>;
  getImageCoords: (img: T) => LonLat;
  getImageAngle: (img: T) => number | undefined;
  isPano: (img: T) => boolean;
  getImageUrl: (img: T) => string;
  getImageDate: (img: T) => Date;
  getImageLink: (img: T) => string;
  getImageLinkUrl: (img: T) => string;
  getPanoUrl: (img: T) => string;
  getDescription?: (img: T, defaultDescription: string) => string;
};

export const getImageFromCenterFactory =
  <T>(
    provider: string,
    {
      getImages,
      getImageCoords,
      getImageAngle,
      isPano,
      getImageUrl,
      getImageDate,
      getImageLink,
      getImageLinkUrl,
      getPanoUrl,
      getDescription,
    }: ImageProvider<T>,
  ) =>
  async (poiCoords: LonLat): Promise<ImageType | null> => {
    const apiImages = await getImages(poiCoords);
    if (!apiImages.length) {
      return null;
    }

    const photos = apiImages.map((pic) => {
      const photoCoords = getImageCoords(pic);
      const angle = getImageAngle(pic);
      return {
        ...pic,
        angleFromPhotoToPoi: getBearing(photoCoords, poiCoords),
        deviationFromStraightSight:
          angle === undefined
            ? Infinity
            : subtractAngle(getBearing(photoCoords, poiCoords), angle),
      };
    });

    const panos = photos.filter(isPano);
    const sorted = (panos.length ? panos : photos).sort(
      (a, b) => a.deviationFromStraightSight - b.deviationFromStraightSight,
    );

    const imageToUse = sorted[0];

    const defaultDescription = t('featurepanel.image_description', {
      provider,
      date: getImageDate(imageToUse).toLocaleString(intl.lang),
    });

    const description =
      getDescription?.(imageToUse, defaultDescription) ?? defaultDescription;

    return {
      provider,
      description,
      imageUrl: getImageUrl(imageToUse),
      linkUrl: getImageLinkUrl(imageToUse),
      link: getImageLink(imageToUse),
      uncertainImage: true,
      panoramaUrl: isPano(imageToUse) ? getPanoUrl(imageToUse) : undefined,
    };
  };
