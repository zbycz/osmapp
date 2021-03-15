import { fetchJson } from '../fetch';

export const getFodyImage = async (center) => {
  try {
    // const url = `https://osm.fit.vutbr.cz/fody-dev/api/close?lat=${center[1]}&lon=${center[0]}&limit=1&distance=50`; //dev
    const url = `https://osm.fit.vutbr.cz/fody/api/close?lat=${center[1]}&lon=${center[0]}&limit=1&distance=50`;
    const { features } = await fetchJson(url);

    // {"type":"FeatureCollection","features":[{"type":"Feature","geometry":{"type":"Point","coordinates":[14.30481,50.09958]},"properties":{"id":25530,"author":"Milancer","ref":"AB030","tags":"pesi:;rozcestnik:","created":"2019-11-10 15:19:18","enabled":"t","distance":4.80058345}}]}
    if (!features.length) {
      return {};
    }

    const image = features[0];
    const { id, author, created } = image.properties;
    return {
      source: 'Fody photodb',
      username: author,
      link: `https://osm.fit.vutbr.cz/fody/?id=${id}`,
      thumb: `https://osm.fit.vutbr.cz/fody/files/250px/${id}.jpg`,
      portrait: true,
      timestamp: created,
    };
  } catch (e) {
    // eslint-disable-next-line no-console
    console.warn('getFodyImage', e);
    return {};
  }
};
