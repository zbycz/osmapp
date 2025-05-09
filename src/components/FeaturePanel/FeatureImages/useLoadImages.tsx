import { useEffect, useMemo, useState } from 'react';
import {
  getImageDefId,
  getInstantImage,
  ImageType,
} from '../../../services/images/getImageDefs';
import { not, publishDbgObject } from '../../../utils';
import { getImageFromApi } from '../../../services/images/getImageFromApi';
import { useFeatureContext } from '../../utils/FeatureContext';
import { ImageDef, isInstant } from '../../../services/types';
import uniqBy from 'lodash/uniqBy';

type ImageWithDef = { def: ImageDef; image: ImageType };
export type ImagesType = ImageWithDef[];

const betterWikimediaImg = (imageA: ImageWithDef, imageB: ImageWithDef) => {
  const imageAUrl = imageA.image.imageUrl;
  const imageBUrl = imageB.image.imageUrl;

  const start = 'https://upload.wikimedia.org/';
  if (!(imageAUrl.startsWith(start) && imageBUrl.startsWith(start))) {
    return null;
  }

  const partsA = imageAUrl.split('/');
  const partsB = imageBUrl.split('/');

  const startA = partsA.slice(0, -1).join('/');
  const startB = partsB.slice(0, -1).join('/');

  const endA = partsA.at(-1);
  const endB = partsB.at(-1);

  const endAMatch = endA.match(/^\d+px-/)?.[0];
  const endBMatch = endB.match(/^\d+px-/)?.[0];

  if (startA !== startB || !endAMatch || !endBMatch) {
    return false;
  }
  const isIdentical =
    endA.slice(endAMatch.length) === endB.slice(endBMatch.length);
  if (!isIdentical) {
    return false;
  }

  const pxA = parseInt(endA.match(/^\d+/)[0]);
  const pxB = parseInt(endB.match(/^\d+/)[0]);

  const preferred = pxA >= pxB ? imageA : imageB;
  const unpreferred = !(pxA >= pxB) ? imageA : imageB;

  return { preferred, unpreferred };
};

const mergeTwoImages = (
  imageA: ImageWithDef,
  imageB: ImageWithDef,
): ImageWithDef | null => {
  const imageAUrl = imageA.image.imageUrl;
  const imageBUrl = imageB.image.imageUrl;

  const mergingData =
    imageAUrl === imageBUrl
      ? { preferred: imageA, unpreferred: imageB }
      : betterWikimediaImg(imageA, imageB);

  if (!mergingData) {
    return null;
  }

  const { preferred, unpreferred } = mergingData;
  const newImage = { ...preferred };

  newImage.image.sameUrlResolvedAlsoFrom = uniqBy(
    [...(newImage.image.sameUrlResolvedAlsoFrom ?? []), unpreferred.image],
    ({ link }) => link,
  );

  return newImage;
};

export const mergeResultFn =
  (def: ImageDef, image: ImageType, defs: ImageDef[]) =>
  (prevImages: ImagesType) => {
    if (image == null) {
      return prevImages;
    }

    const defIds = defs.map(getImageDefId);

    const mergedUnsorted = prevImages.map(
      (item) => mergeTwoImages(item, { image, def }) ?? item,
    );
    if (!prevImages.some((item) => mergeTwoImages(item, { image, def }))) {
      mergedUnsorted.push({ image, def });
    }

    return mergedUnsorted.sort((a, b) => {
      const aIndex = defIds.indexOf(getImageDefId(a.def));
      const bIndex = defIds.indexOf(getImageDefId(b.def));
      return aIndex - bIndex;
    });
  };

const getInitialState = (defs: ImageDef[]) =>
  defs?.filter(isInstant)?.map((def) => ({
    def,
    image: getInstantImage(def),
  })) ?? [];

export const useLoadImages = () => {
  const { feature } = useFeatureContext();
  const defs = feature?.imageDefs;
  const apiDefs = useMemo(() => defs?.filter(not(isInstant)) ?? [], [defs]);

  const initialState = useMemo(() => getInitialState(defs), [defs]);
  const [loading, setLoading] = useState(apiDefs.length > 0);
  const [images, setImages] = useState<ImagesType>(initialState);

  useEffect(() => {
    setImages(initialState);
    const promises = apiDefs.map(async (def) => {
      const image = await getImageFromApi(def);
      setImages(mergeResultFn(def, image, defs));
    });

    Promise.all(promises).then(() => {
      setLoading(false);
    });
  }, [apiDefs, defs, initialState]);

  publishDbgObject('last images', images);
  return { loading, images: images.filter((item) => item.image != null) };
};
