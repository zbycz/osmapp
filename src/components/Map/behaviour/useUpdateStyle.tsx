import type { GeoJSONSource, Map } from 'maplibre-gl';
import cloneDeep from 'lodash/cloneDeep';
import { useMapEffect } from '../../helpers';
import { basicStyle } from '../styles/basicStyle';
import { outdoorStyle } from '../styles/outdoorStyle';
import { osmappLayers } from '../../LayerSwitcher/osmappLayers';
import { rasterStyle } from '../styles/rasterStyle';
import { DEFAULT_MAP } from '../../../config';
import { makinaAfricaStyle } from '../styles/makinaAfricaStyle';
import { climbingLayers } from '../styles/layers/climbingLayers';
import { EMPTY_GEOJSON_SOURCE } from '../consts';
import { fetchCrags } from '../../../services/fetchCrags';

export const getRasterStyle = (key) => {
  const url = osmappLayers[key]?.url ?? key; // if `key` not found, it contains tiles URL
  return rasterStyle(key, url);
};

const getBaseStyle = (key) => {
  if (key === 'basic') {
    return basicStyle;
  }
  if (key === 'makinaAfrica') {
    return makinaAfricaStyle;
  }
  if (key === 'outdoor') {
    return outdoorStyle;
  }

  return getRasterStyle(key);
};

export const useUpdateStyle = useMapEffect((map: Map, activeLayers) => {
  const [basemap, ...overlays] = activeLayers;

  const key = basemap ?? DEFAULT_MAP;

  map.setMaxZoom(osmappLayers[key]?.maxzoom ?? 24); // TODO find a way how to zoom bing further (now it stops at 19)

  const style = cloneDeep(getBaseStyle(key));
  overlays.forEach((overlayKey) => {
    const overlay = osmappLayers[overlayKey];

    if (overlay?.type === 'overlay') {
      const raster = getRasterStyle(overlayKey);
      style.sources[overlayKey] = raster.sources[overlayKey];
      style.layers.push(raster.layers[0]);

      // TODO maxzoom 19 only for snow overlay
    }

    if (overlay?.type === 'overlayClimbing') {
      style.sources.climbing = EMPTY_GEOJSON_SOURCE;
      style.layers.push(...climbingLayers); // must be also in `layersWithOsmId` because of hover effect
      fetchCrags().then(
        (geojson) => {
          const geojsonSource = map.getSource('climbing') as GeoJSONSource;
          geojsonSource?.setData(geojson); // TODO can be undefined at first map render
        },
        (error) => {
          console.warn('Climbing Layer failed to fetch.', error); // eslint-disable-line no-console
        },
      );
    }
  });

  map.setStyle(style, { diff: true });
});
