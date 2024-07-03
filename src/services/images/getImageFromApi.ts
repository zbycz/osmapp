import { fetchJson } from '../fetch';
import { getCommonsImageUrl } from './getWikiImage';
import { ImageDef, isCenter, isTag } from '../types';
import { getMapillaryImage } from './getMapillaryImage';
import { getFodyImage } from './getFodyImage';
import { ImageType2 } from './getImageDefs';

// TODO can we get image out of category ?
const getCommonsApiUrl = (title) =>
  `https://commons.wikimedia.org/w/api.php?action=query&prop=imageinfo&iiprop=url&iiurlwidth=640&format=json&titles=${encodeURIComponent(
    title,
  )}&origin=*`;

const fetchWikimediaCommons = async (title): Promise<ImageType2 | null> => {
  const data = await fetchJson(getCommonsApiUrl(title));
  const page = Object.values(data.query.pages)[0] as any;
  if (!page.imageinfo?.length) {
    return null;
  }
  const images = page.imageinfo;
  return {
    imageUrl: images[0].thumburl,
    description: 'Wikimedia Commons (wikimedia_commons=*)',
    link: page.title,
    linkUrl: images[0].descriptionshorturl,
    // portrait: images[0].thumbwidth < images[0].thumbheight,
  };
};

const getWikidataApiUrl = (entity) =>
  `https://www.wikidata.org/w/api.php?action=wbgetclaims&property=P18&format=json&entity=${encodeURIComponent(
    entity,
  )}&origin=*`;

const fetchWikidata = async (entity: string): Promise<ImageType2 | null> => {
  const data = await fetchJson(getWikidataApiUrl(entity));

  if (!data.claims?.P18) {
    return null;
  }

  const imagesP18 = data.claims.P18;
  const candidates =
    imagesP18.length > 1
      ? imagesP18.filter(({ rank }) => rank !== 'deprecated')
      : [];
  const entry = candidates.length > 0 ? candidates[0] : imagesP18[0];
  const file = `File:${entry.mainsnak.datavalue.value}`;
  return {
    imageUrl: getCommonsImageUrl(file, 410),
    description: 'Wikidata image (wikidata=*)',
    linkUrl: `https://www.wikidata.org/wiki/${entity}`,
    link: entity,
  };
};

const parseWikipedia = (k, v) => {
  if (v.includes(':')) {
    const parts = v.split(':', 2);
    return { country: parts[0], title: parts[1] };
  }
  if (k.match(/:[a-z]{2}(-[a-z]{2})?$/i)) {
    // TODO only wiki languages?
    return { country: k.split(':', 2)[1], title: v };
  }
  return { country: 'en', title: v };
};

const getWikipediaApiUrl = (k, v) => {
  const { country, title } = parseWikipedia(k, v);
  const titles = encodeURIComponent(title);
  return `https://${country}.wikipedia.org/w/api.php?action=query&prop=pageimages&pithumbsize=640&format=json&titles=${titles}&origin=*`;
};

const fetchWikipedia = async (k, v): Promise<ImageType2 | null> => {
  const data = await fetchJson(getWikipediaApiUrl(k, v));
  const page = Object.values(data.query.pages)[0] as any;
  if (!page.pageimage) {
    return null;
  }
  return {
    imageUrl: page.thumbnail.source,
    description: `Wikipedia (${k})`,
    linkUrl: `https://commons.wikimedia.org/wiki/File:${page.pageimage}`,
    link: `File:${page.pageimage}`,
    // portrait: page.thumbnail.width < page.thumbnail.height,
  };
};

export const getImageFromApiRaw = async (
  def: ImageDef,
): Promise<ImageType2 | null> => {
  if (isCenter(def)) {
    const { service, center } = def;
    if (service === 'mapillary') {
      return getMapillaryImage(center);
    }

    if (service === 'fody') {
      return getFodyImage(center);
    }
  }

  if (isTag(def)) {
    const { k, v } = def;
    if (k.startsWith('image') && v.match(/^File:/)) {
      return fetchWikimediaCommons(v);
    }
    if (k.startsWith('wikidata')) {
      return fetchWikidata(v);
    }
    if (k.startsWith('wikimedia_commons')) {
      return fetchWikimediaCommons(v);
    }
    if (k.startsWith('wikipedia')) {
      return fetchWikipedia(k, v);
    }
  }

  throw new Error(`No match getImageFromApi(${JSON.stringify(def)})`);
};

export const getImageFromApi = async (
  def: ImageDef,
): Promise<ImageType2 | null> => {
  try {
    return await getImageFromApiRaw(def);
  } catch (e) {
    console.warn(e); // eslint-disable-line no-console
    return null;
  }
};
