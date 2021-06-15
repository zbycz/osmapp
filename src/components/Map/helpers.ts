import { OsmApiId } from '../../services/helpers';
import { basicStyle } from './styles/basicStyle';

const isOsmLayer = (id) => {
  if (id.startsWith('place-country-')) return false; // https://github.com/zbycz/osmapp/issues/35
  if (id === 'place-continent') return false;
  if (id === 'water-name-ocean') return false;
  const prefixes = ['water-name-', 'poi-', 'place-'];
  return prefixes.some((prefix) => id.startsWith(prefix));
};

export const layersWithOsmId = basicStyle.layers // TODO make it custom for basic/outdoor + revert place_
  .map((x) => x.id)
  .filter((id) => isOsmLayer(id));

export const getIsOsmObject = ({ id, layer }) => {
  // these layers with id <= ~10000 are broken
  // eg. US states
  if (layer.id === 'place-other' && id < 10e5) {
    return false;
  }
  // eg. "Mediterranean Sea"
  if (layer.id === 'water-name-other' && id < 10e5) {
    return false;
  }
  return layersWithOsmId.includes(layer.id);
};

export const convertMapIdToOsmId = (feature) => {
  if (!feature || !feature.id) return false;

  const mapId = `${feature.id}`;
  const id = mapId.substring(0, mapId.length - 1);
  const numType = mapId.substring(mapId.length - 1);
  const mapTypeToOsm = { 0: 'node', 1: 'way', 4: 'relation' };

  return { id, type: mapTypeToOsm[numType] ?? `type${numType}` };
};

export const convertOsmIdToMapId = (apiId: OsmApiId) => {
  const osmToMapType = { node: 0, way: 1, relation: 4 };
  return parseInt(`${apiId.id}${osmToMapType[apiId.type]}`, 10);
};
