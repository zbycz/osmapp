import { useEffect, useMemo, useState } from 'react';
import {
  getInstantImage,
  ImageType,
} from '../../../services/images/getImageDefs';
import { not, publishDbgObject } from '../../../utils';
import { getImageFromApi } from '../../../services/images/getImageFromApi';
import { useFeatureContext } from '../../utils/FeatureContext';
import { ImageDef, isInstant } from '../../../services/types';

export type ImageGroup = { def: ImageDef; images: ImageType[] }[];

export const mergeResultFn =
  (def: ImageDef, images: ImageType[], defs: ImageDef[]) =>
  (prevImages: ImageGroup): ImageGroup => {
    if (images.length === 0) {
      return prevImages;
    }

    const imageUrls = images.map(({ imageUrl }) => imageUrl);

    const found = prevImages.find((group) =>
      group.images.some((img) => imageUrls.includes(img.imageUrl)),
    );

    if (found) {
      // Update existing group
      const updatedGroup = {
        ...found,
        images: found.images.map((img) => {
          if (!imageUrls.includes(img.imageUrl)) return img;

          return {
            ...img,
            sameUrlResolvedAlsoFrom: [
              ...(img.sameUrlResolvedAlsoFrom ?? []),
              ...images,
            ],
          };
        }),
      };

      return prevImages.map((group) =>
        group.def === found.def ? updatedGroup : group,
      );
    }

    // Add new group
    const sorted = [...prevImages, { def, images }].sort((a, b) => {
      const aIndex = defs.findIndex((item) => item === a.def);
      const bIndex = defs.findIndex((item) => item === b.def);
      return aIndex - bIndex;
    });

    return sorted;
  };

const getInitialState = (defs: ImageDef[]): ImageGroup =>
  defs?.filter(isInstant)?.map((def) => ({
    def,
    images: getInstantImage(def) ? [getInstantImage(def)] : [],
  })) ?? [];

export const useLoadImages = () => {
  const { feature } = useFeatureContext();
  const defs = feature?.imageDefs;
  const apiDefs = useMemo(() => defs?.filter(not(isInstant)) ?? [], [defs]);

  const initialState = useMemo(() => getInitialState(defs), [defs]);
  const [loading, setLoading] = useState(apiDefs.length > 0);
  const [groups, setGroups] = useState<ImageGroup>(initialState);

  useEffect(() => {
    setGroups(initialState);
    const promises = apiDefs.map(async (def) => {
      const images = await getImageFromApi(def);
      setGroups(mergeResultFn(def, images, defs));
    });

    Promise.all(promises).then(() => {
      setLoading(false);
    });
  }, [apiDefs, defs, initialState]);

  publishDbgObject('last images', groups);
  return { loading, groups: groups.filter((group) => group.images.length > 0) };
};
