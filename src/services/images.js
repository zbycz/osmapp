import { fetchJson, getShortId, removeFetchCache } from './helpers';

const getMapillaryImage = async center => {
  const lonlat = center.map(x => x.toFixed(5)).join(',');
  const url = `https://a.mapillary.com/v3/images?client_id=TTdNZ2w5eTF6MEtCNUV3OWNhVER2dzpjMjdiZGE1MWJmYzljMmJi&lookat=${lonlat}&closeto=${lonlat}`;
  const { features } = await fetchJson(url);

  // {"type":"FeatureCollection","features":[{"type":"Feature","properties":{"ca":71.80811,"camera_make":"Apple","camera_model":"iPhone6,2","captured_at":"2015-05-08T06:02:41.227Z","key":"rPU1sldzMCVIMN2XmjDf2A","pano":false,"sequence_key":"-zanzZ2HpdOhkw-uG166Pg","user_key":"M7Mgl9y1z0KB5Ew9caTDvw","username":"zbycz"},"geometry":{"type":"Point","coordinates":[14.390517,50.100268]}}]}
  if (!features.length) {
    removeFetchCache(url);
    return;
  }

  const image = features[0];
  const { key, username } = image.properties;
  console.log('mplr', key);
  return {
    source: `Mapillary`,
    username,
    link: `https://www.mapillary.com/app/?focus=photo&pKey=${key}`,
    thumb: `https://images.mapillary.com/${key}/thumb-640.jpg`,
  };
};

export const LOADING = null;
let mapillary, mapillaryId;

export const getFeatureImage = async feature => {
  if (feature.nonOsmObject) {
    return await getMapillaryImage(feature.center);
  }

  // first pass may be a skeleton
  const osmid = getShortId(feature.osmMeta);
  if (feature.skeleton) {
    mapillary = getMapillaryImage(feature.center);
    mapillaryId = osmid;
    return LOADING;
  }

  // 2nd pass - full object (discard mapillary promise when different)
  if (mapillaryId !== osmid) {
    mapillary = undefined;
  }

  const wikiUrl = getWikiApiUrl(feature.tags);
  if (wikiUrl) {
    const wikiImage = await getWikiImage(wikiUrl);
    if (wikiImage.thumb) {
      return wikiImage;
    }
  }

  // fallback to mapillary
  return mapillary ?? (await getMapillaryImage(feature.center));
};

// From https://github.com/osmcz/osmcz/blob/0d3eaaa/js/poi-popup.js - MIT
const getWikiApiUrl = tags => {
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

  const wikipediaKeys = Object.keys(tags).filter(k => k.match(/^wikipedia/));
  if (wikipediaKeys.length) {
    const value = tags[wikipediaKeys[0]];
    const country = value.includes(':') ? value.split(':')[0] : 'en';
    return `https://${country}.wikipedia.org/w/api.php?action=query&prop=pageimages&pithumbsize=640&format=json&titles=${encodeURIComponent(
      value,
    )}`;
  }
};

const getWikiImage = async wikiUrl => {
  const data = await fetchJson(`${wikiUrl}&origin=*`);
  const replyType = getWikiType(data);
  console.log('getWikiImage', replyType, data);

  if (replyType === 'wikidata') {
    if (!data.claims || !data.claims.P18) {
      return {};
    }
    // In wikidata entry is image name, but we need thumbnail,
    // so we will convert wikidata reply to wikimedia_commons tag
    const fakeTags = {
      wikimedia_commons: 'File:' + data.claims.P18[0].mainsnak.datavalue.value,
    };
    const url = getWikiApiUrl(fakeTags);
    return await getWikiImage(url);
  }

  const page = Object.values(data.query.pages)[0];
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

  return {};
};

// Analyze reply and identify wikidata / wikimedia / wikipedia content
function getWikiType(d) {
  if (d.query) {
    if (Object.keys(d.query.pages)[0]) {
      const k = Object.keys(d.query.pages)[0];
      if (d.query.pages[k].imageinfo) return 'wikimedia';
      if (d.query.pages[k].pageimage) return 'wikipedia';
    }
  }
  if (d.claims) return 'wikidata';
}
