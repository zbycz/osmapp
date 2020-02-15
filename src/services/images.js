import { fetchText, getShortId, removeFetchCache } from './helpers';

const getMapillaryUrl = async center => {
  const lonlat = center.map(x => x.toFixed(5)).join(',');
  const url = `https://a.mapillary.com/v3/images?client_id=TTdNZ2w5eTF6MEtCNUV3OWNhVER2dzpjMjdiZGE1MWJmYzljMmJi&lookat=${lonlat}&closeto=${lonlat}`;
  const data = await fetchText(url);

  // {"type":"FeatureCollection","features":[{"type":"Feature","properties":{"ca":71.80811,"camera_make":"Apple","camera_model":"iPhone6,2","captured_at":"2015-05-08T06:02:41.227Z","key":"rPU1sldzMCVIMN2XmjDf2A","pano":false,"sequence_key":"-zanzZ2HpdOhkw-uG166Pg","user_key":"M7Mgl9y1z0KB5Ew9caTDvw","username":"zbycz"},"geometry":{"type":"Point","coordinates":[14.390517,50.100268]}}]}
  const { features } = JSON.parse(data);
  if (!features.length) {
    removeFetchCache(url);
    return;
  }

  const image = features[0];
  const { key } = image.properties;
  console.log('mplr', key);
  return `https://images.mapillary.com/${key}/thumb-640.jpg`;
};

let mapillary, mapillaryId;

export const getFeatureImage = async feature => {
  if (feature.nonOsmObject) {
    return await getMapillaryUrl(feature.center);
  }

  // first pass is skeleton
  const osmid = getShortId(feature.osmMeta);
  if (feature.skeleton) {
    mapillary = getMapillaryUrl(feature.center);
    mapillaryId = osmid;
    return;
  }

  if (mapillaryId !== osmid) {
    mapillary = undefined;
  }

  // second pass is full object, can fetch wikipage by tags
  const wikiUrl = getWikiApiUrl(feature.tags);
  if (wikiUrl) {
    const image = await getImage(wikiUrl);
    return image.thumb;
  }

  return mapillary ?? (await getMapillaryUrl(feature.center));
};

// From https://github.com/osmcz/osmcz/blob/0d3eaaa/js/poi-popup.js - MIT
const getWikiApiUrl = tags => {
  if (tags.wikimedia_commons) {
    return `https://commons.wikimedia.org/w/api.php?action=query&prop=imageinfo&iiprop=url&iiurlwidth=640&format=json&titles=${encodeURIComponent(
      tags.wikimedia_commons,
    )}`;
  }

  // if (tags.wikidata) {
  //   return `https://www.wikidata.org/w/api.php?action=wbgetclaims&property=P18&format=json&entity=${(encodeURIComponent(tags.wikidata))}`;
  // }

  const wikipedia = Object.keys(tags).filter(k => k.match(/^wikipedia/));
  if (wikipedia.length) {
    const value = tags[wikipedia];
    const country = value.includes(':') ? value.split(':')[0] : 'en';
    return `https://${country}.wikipedia.org/w/api.php?action=query&prop=pageimages&pithumbsize=640&format=json&titles=${encodeURIComponent(
      value,
    )}`;
  }
};

const getImage = async wikiUrl => {
  const text = await fetchText(`${wikiUrl}&origin=*`);
  const data = JSON.parse(text);
  const replyType = getWikiType(data);
  console.log(data, replyType);

  const page = Object.values(data.query.pages)[0];
  if (replyType === 'wikimedia') {
    const images = page.imageinfo;
    return (
      images.length && {
        page: images[0].descriptionshorturl,
        thumb: images[0].thumburl,
      }
    );
  }

  if (replyType === 'wikipedia') {
    return (
      page.pageimage && {
        page: `https://commons.wikimedia.org/wiki/File:${page.pageimage}`,
        thumb: page.thumbnail.source,
      }
    );
  }

  // else if (replyType == 'wikidata') {
  //   const reply = processWikidataReply(data);
  //   if (!reply.k) {
  //     // Wikidata entry does not contains image
  //     // try other tags
  //     if (wikimedia.k)
  //       reply = wikimedia;
  //     else if (wikipedia.k)
  //       reply = wikipedia;
  //   }
  //
  //   // get image thumbnail url or try wikimedia/wikipedia if there is no image on wikidata
  //   if (reply.k) {
  //     const url = getWikiApiUrl(reply);
  //     $.ajax({
  //       url: xhd_proxy_url,
  //       data: {
  //         url: url
  //       },
  //       dataType: 'json',
  //       success: function (data) {
  //         if (getWikiType(data) == 'wikimedia') {
  //           feature.wikimedia = data;
  //           showWikimediaCommons();
  //         } else if (getWikiType(data) == 'wikipedia') {
  //           feature.wikipedia = data;
  //           showWikimediaCommons();
  //         }
  //       }
  //     });
  //   }
  // }
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

// In wikidata entry is image name. but we need thumbnail,
// so we will convert wikidata reply to wikimedia_commons tag
function processWikidataReply(d) {
  const tags = {};
  if (d.claims.P18) {
    tags.wikimedia_commons = 'File:' + d.claims.P18[0].mainsnak.datavalue.value;
  }
  return tags;
}
