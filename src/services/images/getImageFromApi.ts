import { fetchJson } from '../fetch';
import { getCommonsImageUrl } from './getWikiImage';
import { ImageDef, isCenter, isTag } from '../types';
import { getMapillaryImage } from './getMapillaryImage';
import { getFodyImage } from './getFodyImage';
import { ImageType2 } from './getImageDefs';

type ImagePromise = Promise<ImageType2 | null>;

const encode = (strings: TemplateStringsArray, ...values: string[]) =>
  strings.reduce((result, string, i) => {
    const value = values[i];
    return result + string + (value ? encodeURIComponent(value) : '');
  }, '');

// TODO can we get image out of category ?
const getCommonsApiUrl = (title: string) =>
  encode`https://commons.wikimedia.org/w/api.php?action=query&prop=imageinfo&iiprop=url&iiurlwidth=640&format=json&titles=${title}&origin=*`;

const fetchCommons = async (k: string, v: string): ImagePromise => {
  const url = getCommonsApiUrl(v);
  const data = await fetchJson(url);
  const page = Object.values(data.query.pages)[0] as any;
  if (!page.imageinfo?.length) {
    return null;
  }
  const images = page.imageinfo;
  return {
    imageUrl: images[0].thumburl,
    description: `Wikimedia Commons (${k}=*)`,
    link: page.title,
    linkUrl: images[0].descriptionshorturl,
    // portrait: images[0].thumbwidth < images[0].thumbheight,
  };
};

const getWikidataApiUrl = (entity: string) =>
  encode`https://www.wikidata.org/w/api.php?action=wbgetclaims&property=P18&format=json&entity=${entity}&origin=*`;

const fetchWikidata = async (entity: string): ImagePromise => {
  const url = getWikidataApiUrl(entity);
  const data = await fetchJson(url);

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
    link: entity,
    linkUrl: `https://www.wikidata.org/wiki/${entity}`,
  };
};

const parseWikipedia = (k: string, v: string) => {
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

const getWikipediaApiUrl = (country: string, title: string) =>
  encode`https://${country}.wikipedia.org/w/api.php?action=query&prop=pageimages&pithumbsize=640&format=json&titles=${title}&origin=*`;

const fetchWikipedia = async (k: string, v: string): ImagePromise => {
  const { country, title } = parseWikipedia(k, v);
  const url = getWikipediaApiUrl(country, title);
  const data = await fetchJson(url);
  const page = Object.values(data.query.pages)[0] as any;
  if (!page.pageimage) {
    return null;
  }
  return {
    imageUrl: page.thumbnail.source,
    description: `Wikipedia (${k}=*)`,
    link: `File:${page.pageimage}`,
    linkUrl: `https://commons.wikimedia.org/wiki/File:${page.pageimage}`,
    // portrait: page.thumbnail.width < page.thumbnail.height,
  };
};

export const getImageFromApiRaw = async (def: ImageDef): ImagePromise => {
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
      return fetchCommons(k, v);
    }
    if (k.startsWith('wikidata')) {
      return fetchWikidata(v);
    }
    if (k.startsWith('wikimedia_commons')) {
      return fetchCommons(k, v);
    }
    if (k.startsWith('wikipedia')) {
      return fetchWikipedia(k, v);
    }
  }

  throw new Error(`No match in getImageFromApi(${JSON.stringify(def)})`);
};

export const getImageFromApi = async (def: ImageDef): ImagePromise => {
  try {
    return await getImageFromApiRaw(def);
  } catch (e) {
    console.warn(e); // eslint-disable-line no-console
    return null;
  }
};
