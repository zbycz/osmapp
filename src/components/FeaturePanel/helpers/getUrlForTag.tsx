const urlRegExp = /^https?:\/\/.+/;

export const getUrlForTag = (k, v) => {
  if (k.match(/:?wikipedia$/)) {
    if (v.match(/:/)) {
      const [lang, article] = v.split(':');
      return `https://${lang}.wikipedia.org/wiki/${article}`;
    }
    return `https://wikipedia.org/wiki/${v}`;
  }
  if (k.match(/^wikipedia:/) || k.match(/:wikipedia/)) {
    const lang = k.split(':').pop();
    return `https://${lang}.wikipedia.org/wiki/${v}`;
  }
  if (k.match(/^wikidata$/) || k.match(/:wikidata$/)) {
    return `https://www.wikidata.org/wiki/${v}`;
  }
  if (k.match(/^wikimedia_commons$/)) {
    return `https://commons.wikimedia.org/wiki/${v}`;
  }
  if (k === 'image' && v.match(/^File:/)) {
    return `https://commons.wikimedia.org/wiki/${v}`;
  }
  if (k === 'ref:npu') {
    const id = encodeURIComponent(v);
    return `https://pamatkovykatalog.cz/uskp/podle-relevance/1/seznam/?h=${id}&chranenoTed=1&hlObj=1&fulltext`;
  }
  if (k === 'fhrs:id') {
    return `https://ratings.food.gov.uk/business/en-GB/${v}`;
  }
  if (k === 'ref:edubase') {
    return `https://get-information-schools.service.gov.uk/Establishments/Establishment/Details/${v}`;
  }
  if (k === 'website') {
    return v.match(urlRegExp) ? v : `http://${v}`;
  }
  if (v.match(urlRegExp)) {
    return v;
  }

  return null;
};
