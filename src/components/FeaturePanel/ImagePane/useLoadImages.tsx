import { useEffect, useMemo, useState } from 'react';
import {
  getInstantImage,
  ImageType,
} from '../../../services/images/getImageDefs';
import { not, publishDbgObject } from '../../../utils';
import { getImageFromApi } from '../../../services/images/getImageFromApi';
import { useFeatureContext } from '../../utils/FeatureContext';
import { ImageDef, isInstant } from '../../../services/types';

export type ImagesType = { def: ImageDef; image: ImageType }[];

export const mergeResultFn =
  (def: ImageDef, image: ImageType, defs: ImageDef[]) =>
  (prevImages: ImagesType) => {
    if (image == null) {
      return prevImages;
    }

    const found = prevImages.find(
      (item) => item.image?.imageUrl === image.imageUrl,
    );
    if (found) {
      (found.image.sameUrlResolvedAlsoFrom ??= []).push(image);
      return [...prevImages];
    }

    const sorted = [...prevImages, { def, image }].sort((a, b) => {
      const aIndex = defs.findIndex((item) => item === a.def);
      const bIndex = defs.findIndex((item) => item === b.def);
      return aIndex - bIndex;
    });
    return sorted;
  };

const getInitialState = (defs: ImageDef[]) =>
  defs?.filter(isInstant)?.map((def) => ({
    def,
    image: getInstantImage(def),
  }));

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
