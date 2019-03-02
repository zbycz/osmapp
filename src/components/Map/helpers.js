// @flow

export function getOsmShortId(features) {
  if (features.length <= 0 || !features[0].id) {
    return false;
  }

  const mapboxglId = `${features[0].id}`;
  const osmId = mapboxglId.substring(0, mapboxglId.length - 1);
  const typeId = mapboxglId.substring(mapboxglId.length - 1);
  const type = { '0': 'n', '1': 'w' }[typeId];
  return type ? `${type}${osmId}` : false;
}

export function dumpFeatures(features) {
  const filtered = features.map(e => {
    delete e.geometry.coordinates;
    delete e.layer.filter;
    delete e.layer.paint;
    return e;
  });
  return JSON.parse(JSON.stringify(filtered));
}
