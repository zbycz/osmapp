import { layersWithOsmId } from './layers';
import { getCenter } from '../../services/getCenter';
import { OsmApiId } from '../../services/helpers';

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

export const dumpFeatures = (features) => JSON.parse(JSON.stringify(features));

export const getSkeleton = (feature, clickCoords) => {
  const isOsmObject = layersWithOsmId.includes(feature.layer.id);
  const osmMeta = isOsmObject
    ? convertMapIdToOsmId(feature)
    : { type: feature.layer.id, id: feature.id };

  return {
    ...feature,
    geometry: feature.geometry,
    center: getCenter(feature.geometry) || clickCoords,
    osmMeta,
    tags: { name: feature.properties && feature.properties.name },
    skeleton: true,
    nonOsmObject: !isOsmObject,
  };
};
