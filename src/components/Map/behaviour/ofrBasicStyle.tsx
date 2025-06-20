import { basicStyle } from '../styles/basicStyle';
import { OSMAPP_SOURCES } from '../consts';

export const ofrBasicStyle = {
  ...basicStyle,
  sources: {
    ...OSMAPP_SOURCES,
    ofr_planet: {
      type: 'vector' as const,
      url: `https://tiles.openfreemap.org/planet`,
    },
  },
  layers: basicStyle.layers.map((layer) =>
    (layer as any).source === 'maptiler_planet'
      ? {
          ...layer,
          source: 'ofr_planet',
        }
      : layer,
  ),
};
