// @flow

export function getOsmShortId(features) {
  if (features.length <= 0 || !features[0].id) {
    return false;
  }

  const idStr = `${features[0].id}`;
  const id = idStr.substring(0, idStr.length - 1);
  const typeId = idStr.substring(idStr.length - 1);
  const type = { '0': 'n', '1': 'w' }[typeId];
  return type ? `${type}${id}` : false;
}

export function getHumanReadable(features) {
  const filtered = features.map(e => {
    delete e.geometry.coordinates;
    delete e.layer.filter;
    delete e.layer.paint;
    return e;
  });
  return JSON.parse(JSON.stringify(filtered));
}
