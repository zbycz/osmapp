import { getOsmappLink, isValidImage } from './helpers';
import { getFodyImage } from './images/getFodyImage';
import { getMapillaryImage } from './images/getMapillaryImage';
import { getWikiApiUrl, getWikiImage } from './images/getWikiImage';
import { Feature, Image } from './types';

export const LOADING = null;

let mapillaryPromise;
let mapillaryForOsmId;

export const getFeatureImage = async (feature: Feature): Promise<Image> => {
  const { center, nonOsmObject, skeleton, tags } = feature;

  // for nonOsmObject we dont expect 2nd pass
  if (nonOsmObject) {
    return center.every(Boolean) ? getMapillaryImage(center) : undefined;
  }

  // first pass may be a skeleton --> start loading mapillary (center is similar)
  const osmid = getOsmappLink(feature);
  if (skeleton && center.every(Boolean)) {
    mapillaryPromise = getMapillaryImage(center);
    mapillaryForOsmId = osmid;
    return LOADING;
  }

  // 2nd pass - full object (discard mapillary promise when different)
  if (mapillaryForOsmId !== osmid) {
    mapillaryPromise = undefined;
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

  const wikiUrl = getWikiApiUrl(tags);
  if (wikiUrl) {
    const wikiImage = await getWikiImage(wikiUrl);
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
  return (
    mapillaryPromise ??
    (center.every(Boolean) ? await getMapillaryImage(center) : undefined)
  );
};
