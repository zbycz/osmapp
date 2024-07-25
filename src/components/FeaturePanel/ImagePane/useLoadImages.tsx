import { useEffect, useState } from 'react';
import {
  getInstantImage,
  ImageType2,
} from '../../../services/images/getImageDefs';
import { not, publishDbgObject } from '../../../utils';
import { getImageFromApi } from '../../../services/images/getImageFromApi';
import { useFeatureContext } from '../../utils/FeatureContext';
import { ImageDef, isCenter, isInstant } from '../../../services/types';

export type ImagesType = { def: ImageDef; image: ImageType2 }[];

// TODO test this fn
const mergeResultFn =
  (def: ImageDef, image: ImageType2) => (prevImages: ImagesType) => {
    if (image == null) {
      return prevImages;
    }

    const found = prevImages.find(
      (item) => item.image?.imageUrl === image.imageUrl,
    );
    if (found) {
      (found.image.sameImageResolvedAlsoFrom ??= []).push(image);
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

export const useLoadImages = () => {
  const { feature } = useFeatureContext();
  const defs = feature?.imageDefs;
  const instantDefs = defs?.filter(isInstant) ?? [];
  const apiDefs = defs?.filter(not(isInstant)) ?? [];

  const initialState = instantDefs.map((def) => ({
    def,
    image: getInstantImage(def),
  }));
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
  }, [defs]);

  publishDbgObject('last images', images);
  return { loading, images: images.filter((item) => item.image != null) };
};
