import { getShortId, isValidImage } from './helpers';
import { getFodyImage } from './images/getFodyImage';
import { getMapillaryImage } from './images/getMapillaryImage';
import { getWikiApiUrl, getWikiImage } from './images/getWikiImage';
import { Image, Feature } from './types';

export const LOADING = null;

let mapillaryPromise;
let mapillaryForOsmId;

export const getFeatureImage = async (feature: Feature): Promise<Image> => {
  // for nonOsmObject we dont expect 2nd pass
  if (feature.nonOsmObject) {
    return getMapillaryImage(feature.center);
  }

  // first pass may be a skeleton --> start loading mapillary (center is similar)
  const osmid = getShortId(feature.osmMeta);
  if (feature.skeleton) {
    mapillaryPromise = getMapillaryImage(feature.center);
    mapillaryForOsmId = osmid;
    return LOADING;
  }

  // 2nd pass - full object (discard mapillary promise when different)
  if (mapillaryForOsmId !== osmid) {
    mapillaryPromise = undefined;
  }

  if (feature.tags.image) {
    const url = feature.tags.image;
    if (await isValidImage(url)) {
      return {
        source: 'image=*',
        link: url,
        thumb: url,
        portrait: true,
      };
    }
  }

  const wikiUrl = getWikiApiUrl(feature.tags);
  if (wikiUrl) {
    const wikiImage = await getWikiImage(wikiUrl);
    if (wikiImage) {
      return wikiImage;
    }
  }

  // fallback to Fody for guideposts etc.
  if (feature.tags.information) {
    const fodyImage = await getFodyImage(feature.center);
    if (fodyImage) {
      return fodyImage;
    }
  }

  // fallback to mapillary
  return mapillaryPromise ?? (await getMapillaryImage(feature.center));
};
