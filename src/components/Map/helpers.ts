import { layersWithOsmId } from './layers';
import { getCenter } from '../../services/getCenter';

export const getOsmId = (feature) => {
  if (!feature || !feature.id) return false;

  const mapboxglId = `${feature.id}`;
  const id = mapboxglId.substring(0, mapboxglId.length - 1);
  const typeId = mapboxglId.substring(mapboxglId.length - 1);
  const typeOsm = { 0: 'node', 1: 'way', 4: 'relation' }[typeId];
  const type = typeOsm || `type${typeId}`;
  return { type, id };
};

export const dumpFeatures = (features) => JSON.parse(JSON.stringify(features));

export const getSkeleton = (feature, clickCoords) => {
  const isOsmObject = layersWithOsmId.includes(feature.layer.id);
  const osmMeta = isOsmObject
    ? getOsmId(feature)
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
