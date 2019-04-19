// @flow

const urlRegExp = /^https?:\/\/.+/;

export const getUrlForTag = (k, v) => {
  if (k.match(/^:?wikipedia$/)) {
    if (v.match(/:/)) {
      const [lang, article] = v.split(':');
      return `https://${lang}.wikipedia.org/wiki/${article}`;
    }
    return `https://wikipedia.org/wiki/${v}`;
  }
  if (k.match(/^wikipedia:/) || k.match(/:wikipedia:/)) {
    const lang = k.split(':').pop();
    return `https://${lang}.wikipedia.org/wiki/${v}`;
  }
  if (k.match(/^wikidata$/)) {
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
    return `http://pamatkovykatalog.cz/?mode=parametric&isProtected=1&presenter=ElementsResults&indexId=${id}`;
  }
  if (k === 'website') {
    return v.match(urlRegExp) ? v : `http://${v}`;
  }
  if (v.match(urlRegExp)) {
    return v;
  }
};
