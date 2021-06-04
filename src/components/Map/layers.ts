import { outdoorStyle } from './outdoorStyle';
import { addHoverPaint } from './hover';

export const style = addHoverPaint(outdoorStyle);

const isOsmLayer = (id) => {
  if (id === 'place-country-3') return false; // "Czechia" not clickable :-(
  const prefixes = ['water-name-', 'poi-', 'place-'];
  return prefixes.some((prefix) => id.startsWith(prefix));
};
export const layersWithOsmId = style.layers
  .map((x) => x.id)
  .filter((id) => isOsmLayer(id));
