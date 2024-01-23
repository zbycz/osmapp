import { useMapEffect } from '../../helpers';
import { basicStyle } from '../styles/basicStyle';
import { outdoorStyle } from '../styles/outdoorStyle';
import { osmappLayers } from '../../LayerSwitcher/osmappLayers';
import { rasterStyle } from '../styles/rasterStyle';
import { DEFAULT_MAP } from '../../../config';
import { makinaAfricaStyle } from '../styles/makinaAfricaStyle';

export const getRasterStyle = (key) => {
  const url = osmappLayers[key]?.url ?? key; // if `key` not found, it contains tiles URL
  return rasterStyle(key, url);
};

export const useUpdateStyle = useMapEffect((map, activeLayers) => {
  const key = activeLayers[0] ?? DEFAULT_MAP;

  map.setMaxZoom(osmappLayers[key]?.maxzoom ?? 24); // TODO find a way how to zoom bing further (now it stops at 19)

  switch (key) {
    case 'basic':
      map.setStyle(basicStyle);
      break;

    case 'makinaAfrica':
      map.setStyle(makinaAfricaStyle);
      break;

    case 'outdoor':
      map.setStyle(outdoorStyle);
      break;

    default:
      map.setStyle(getRasterStyle(key));
      map.setZoom(Math.round(map.getZoom()));
      break;
  }
});
