// From https://github.com/osmcz/osmcz/blob/0d3eaaa/js/poi-popup.js - MIT
import { fetchJson } from '../fetch';
import { Image } from '../types';

export const getWikiApiUrl = (tags) => {
  if (tags.wikidata) {
    return `https://www.wikidata.org/w/api.php?action=wbgetclaims&property=P18&format=json&entity=${encodeURIComponent(
      tags.wikidata,
    )}`;
  }

  if (tags.wikimedia_commons) {
    return `https://commons.wikimedia.org/w/api.php?action=query&prop=imageinfo&iiprop=url&iiurlwidth=640&format=json&titles=${encodeURIComponent(
      tags.wikimedia_commons,
    )}`;
  }

  const wikipediaKeys = Object.keys(tags).filter((k) => k.match(/^wikipedia/));
  if (wikipediaKeys.length) {
    const value = tags[wikipediaKeys[0]];
    const country = value.includes(':') ? value.split(':')[0] : 'en';
    return `https://${country}.wikipedia.org/w/api.php?action=query&prop=pageimages&pithumbsize=640&format=json&titles=${encodeURIComponent(
      value,
    )}`;
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
  console.log('getWikiImage', replyType, data); // eslint-disable-line no-console

  if (replyType === 'wikidata') {
    if (!data.claims || !data.claims.P18) {
      return undefined;
    }
    // In wikidata entry is image name, but we need thumbnail,
    // so we will convert wikidata reply to wikimedia_commons tag
    const fakeTags = {
      wikimedia_commons: `File:${data.claims.P18[0].mainsnak.datavalue.value}`,
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
