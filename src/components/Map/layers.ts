import { mapboxStyle } from './mapboxStyle';

const isOsmLayer = (id) => {
  if (id === 'place-country-3') return false; // "Czechia" not clickable :-(
  const prefixes = ['water-name-', 'poi-', 'place-'];
  return prefixes.some((prefix) => id.startsWith(prefix));
};
export const layersWithOsmId = mapboxStyle.layers
  .map((x) => x.id)
  .filter((id) => isOsmLayer(id));

// TODO this needs refactoring/move
