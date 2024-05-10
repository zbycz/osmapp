import { isValidImage } from './helpers';
import { getFodyImage } from './images/getFodyImage';
import { getMapillaryImage } from './images/getMapillaryImage';
import { getWikiApiUrl, getWikiImage } from './images/getWikiImage';
import { Feature, Image, ImageTag } from './types';

export const LOADING = null;

export type Image2 = {
  source?: string;
  link: string;
  thumb: string;
  sharp?: string;
  username?: string;
  portrait?: boolean;
  timestamp?: string;
  isPano?: boolean;

  // TODO
  imageTag?: ImageTag;
  width: number;
  height: number;
};

// TODO getFeatureImages(): Promise<Image>[] ?
//   Promise.any().then((...imgs)=> setImages(imgs)) ??
//   ssr: /api/image?id=r123
//         if( feature.ssr ) use first image and fetch only the rest

// getImagesAsCallbacks

// { type: 'wiki/commons/image', resolvedImage: null }
// { type: 'commons', resolvedImage: Image2 }

// pořadí:
// commons
// image (?)
// wikidata
// wikipedia
// fody
// mapillary 3x
// server image

// export const getFeatureImages = (feature: Feature): Promise<Image>[] => {

export const getFeatureImage = async (feature: Feature): Promise<Image> => {
  const { center, nonOsmObject, skeleton, tags, imageTags } = feature;

  if (skeleton) {
    return LOADING;
  }

  if (nonOsmObject) {
    return center ? getMapillaryImage(center) : undefined;
  }

  if (tags?.image) {
    if (await isValidImage(tags.image)) {
      return {
        source: 'image=*',
        link: tags.image,
        thumb: tags.image,
        portrait: true,
      };
    }
  }

  const wikiApiUrl = getWikiApiUrl(tags);
  if (wikiApiUrl) {
    const wikiImage = await getWikiImage(wikiApiUrl);
    if (wikiImage) {
      return wikiImage;
    }
  }

  // fallback to Fody for guideposts etc.
  if (center && tags?.information) {
    const fodyImage = await getFodyImage(center);
    if (fodyImage) {
      return fodyImage;
    }
  }

  // fallback to mapillary
  return center ? getMapillaryImage(center) : undefined;
};
