import { useEffect, useMemo, useState } from 'react';
import {
  getInstantImage,
  ImageType,
} from '../../../services/images/getImageDefs';
import { not, publishDbgObject } from '../../../utils';
import { getImageFromApi } from '../../../services/images/getImageFromApi';
import { useFeatureContext } from '../../utils/FeatureContext';
import { ImageDef, isCenter, isInstant } from '../../../services/types';

export type ImagesType = { def: ImageDef; image: ImageType }[];

// TODO test this fn
const mergeResultFn =
  (def: ImageDef, image: ImageType) => (prevImages: ImagesType) => {
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

    if (!isCenter(def)) {
      // leave center images in the end
      const centerIndex = prevImages.findIndex((item) => isCenter(item.def));
      if (centerIndex >= 0) {
        return [
          ...prevImages.slice(0, centerIndex),
          { def, image },
          ...prevImages.slice(centerIndex),
        ];
      }
    }

    return [...prevImages, { def, image }];
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
      setImages(mergeResultFn(def, image));
    });

    Promise.all(promises).then(() => {
      setLoading(false);
    });
  }, [apiDefs, defs, initialState]);

  publishDbgObject('last images', images);
  return { loading, images: images.filter((item) => item.image != null) };
};
