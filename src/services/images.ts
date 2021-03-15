import { getShortId } from './helpers';
import { getFodyImage } from './images/getFodyImage';
import { getMapillaryImage } from './images/getMapillaryImage';
import { getWikiApiUrl, getWikiImage } from './images/getWikiImage';

export const LOADING = null;
let mapillaryPromise;
let mapillaryId;

export const getFeatureImage = async (feature) => {
  // for nonOsmObject we dont expect 2nd pass
  if (feature.nonOsmObject) {
    return getMapillaryImage(feature.center);
  }

  // first pass may be a skeleton
  const osmid = getShortId(feature.osmMeta);
  if (feature.skeleton) {
    mapillaryPromise = getMapillaryImage(feature.center);
    mapillaryId = osmid;
    return LOADING;
  }

  // 2nd pass - full object (discard mapillary promise when different)
  if (mapillaryId !== osmid) {
    mapillaryPromise = undefined;
  }

  const wikiUrl = getWikiApiUrl(feature.tags);
  if (wikiUrl) {
    const wikiImage = await getWikiImage(wikiUrl);
    if (wikiImage.thumb) {
      return wikiImage;
    }
  }

  // fallback to Fody
  const fodyImage = await getFodyImage(feature.center);
  if (fodyImage.thumb) {
    return fodyImage;
  }

  // fallback to mapillary
  return mapillaryPromise ?? (await getMapillaryImage(feature.center));
};
