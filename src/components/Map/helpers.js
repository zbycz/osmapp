// @flow

import { getCenter } from '../../services/helpers';

export const getOsmId = feature => {
  if (!feature || !feature.id) return false;

  const mapboxglId = `${feature.id}`;
  const id = mapboxglId.substring(0, mapboxglId.length - 1);
  const typeId = mapboxglId.substring(mapboxglId.length - 1);
  const typeOsm = { '0': 'node', '1': 'way' }[typeId];
  const type = typeOsm || `type${typeId}`;
  return { type, id };
};

export const dumpFeatures = features => {
  return JSON.parse(JSON.stringify(features));
};

export const getSkeleton = (feature, clickCoords) => {
  const osmApiId = getOsmId(feature);
  const isOsmObject = ['node', 'way'].includes(osmApiId.type);
  return {
    ...feature,
    geometry: feature.geometry,
    center: getCenter(feature) || clickCoords,
    osmMeta: { ...osmApiId },
    tags: { name: feature.properties && feature.properties.name },
    skeleton: true,
    nonOsmObject: !isOsmObject,
  };
};
