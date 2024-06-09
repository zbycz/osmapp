// From https://github.com/osmcz/osmcz/blob/0d3eaaa/js/poi-popup.js - MIT
import { md5 } from 'js-md5';
import { fetchJson } from '../fetch';
import { Image } from '../types';
import { removeFilePrefix } from '../../components/FeaturePanel/Climbing/utils/photo';

const getCommonsApiUrl = (title) =>
  `https://commons.wikimedia.org/w/api.php?action=query&prop=imageinfo&iiprop=url&iiurlwidth=640&format=json&titles=${encodeURIComponent(
    title,
  )}`;

const getWikidataApiUrl = (title) =>
  `https://www.wikidata.org/w/api.php?action=wbgetclaims&property=P18&format=json&entity=${encodeURIComponent(
    title,
  )}`;

const getWikipediaApiUrl = (country, title) =>
  `https://${country}.wikipedia.org/w/api.php?action=query&prop=pageimages&pithumbsize=640&format=json&titles=${encodeURIComponent(
    title,
  )}`;

const parseCountry = (title) => {
  if (title.includes(':')) {
    const parts = title.split(':');
    return { country: parts[0], title: parts[1] };
  }
  return { title, country: 'en' };
};

export const getWikiApiUrl = (tags) => {
  if (tags.image?.match(/^File:/)) {
    return getCommonsApiUrl(tags.image);
  }

  if (tags.wikidata) {
    return getWikidataApiUrl(tags.wikidata);
  }

  if (tags.wikimedia_commons) {
    return getCommonsApiUrl(tags.wikimedia_commons);
  }

  if (tags.wikipedia) {
    const { country, title } = parseCountry(tags.wikipedia);
    return getWikipediaApiUrl(country, title);
  }

  const localWikis = Object.keys(tags).filter((k) => k.match(/^wikipedia:/));
  if (localWikis.length) {
    const key = localWikis[0];
    const { country } = parseCountry(key);
    return getWikipediaApiUrl(country, tags[key]);
  }

  return null;
};

// Analyze reply and identify wikidata / wikimedia / wikipedia content
const getWikiType = (d) => {
  if (d.query) {
    if (Object.keys(d.query.pages)[0]) {
      const k = Object.keys(d.query.pages)[0];
      if (d.query.pages[k].imageinfo) return 'wikimedia';
      if (d.query.pages[k].pageimage) return 'wikipedia';
    }
  }
  return d.claims ? 'wikidata' : null;
};

export const getWikiImage = async (wikiUrl): Promise<Image> => {
  const data = await fetchJson(`${wikiUrl}&origin=*`);
  const replyType = getWikiType(data);

  if (replyType === 'wikidata') {
    if (!data.claims?.P18) {
      return undefined;
    }
    const imagesP18 = data.claims.P18;
    const candidates =
      imagesP18.length > 1
        ? imagesP18.filter(({ rank }) => rank !== 'deprecated')
        : [];
    const entry = candidates.length > 0 ? candidates[0] : imagesP18[0];
    // In wikidata entry is image name, but we need thumbnail,
    // so we will convert wikidata reply to wikimedia_commons tag
    const fakeTags = {
      wikimedia_commons: `File:${entry.mainsnak.datavalue.value}`,
    };
    return getWikiImage(getWikiApiUrl(fakeTags));
  }

  const page = Object.values(data.query.pages)[0] as any;
  if (replyType === 'wikimedia' && page.imageinfo.length) {
    const images = page.imageinfo;
    return {
      source: 'Wikimedia',
      link: images[0].descriptionshorturl,
      thumb: images[0].thumburl,
      portrait: images[0].thumbwidth < images[0].thumbheight,
    };
  }

  if (replyType === 'wikipedia' && page.pageimage) {
    return {
      source: 'Wikipedia',
      link: `https://commons.wikimedia.org/wiki/File:${page.pageimage}`,
      thumb: page.thumbnail.source,
      portrait: page.thumbnail.width < page.thumbnail.height,
    };
  }

  return undefined;
};

export const getCommonsImageUrl = (
  photoName: string,
  width: number,
): string | null => {
  if (!photoName) return null;
  if (!photoName.startsWith('File:')) {
    // eslint-disable-next-line no-console
    console.warn('Invalid Commons photo name without "File:":', photoName);
    return null;
  }
  const fileName = photoName.replace(/^File:/, '').replace(/ /g, '_');
  const hash = md5(fileName);
  const part1 = hash[0];
  const part2 = hash.substring(0, 2);
  return `https://upload.wikimedia.org/wikipedia/commons/thumb/${part1}/${part2}/${fileName}/${width}px-${fileName}`;
};
