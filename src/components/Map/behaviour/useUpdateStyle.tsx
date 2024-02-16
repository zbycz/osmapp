import type { Map, GeoJSONSource } from 'maplibre-gl';
import cloneDeep from 'lodash/cloneDeep';
import { useMapEffect } from '../../helpers';
import { basicStyle } from '../styles/basicStyle';
import { outdoorStyle } from '../styles/outdoorStyle';
import { osmappLayers } from '../../LayerSwitcher/osmappLayers';
import { rasterStyle } from '../styles/rasterStyle';
import { DEFAULT_MAP } from '../../../config';
import { makinaAfricaStyle } from '../styles/makinaAfricaStyle';
import { fetchJson } from '../../../services/fetch';
import { overpassGeomToGeojson } from '../../../services/overpassSearch';
import { climbingLayers } from '../styles/layers/climbingLayers';
import { emptyGeojsonSource } from '../consts';

const fetchCrags = async () => {
  const query = `[out:json][timeout:25];(relation["climbing"="crag"](48,11,51,19););out geom qt;`;
  const data = encodeURIComponent(query);
  const url = `https://overpass-api.de/api/interpreter?data=${data}`;
  const overpass = await fetchJson(url);
  const features = overpassGeomToGeojson(overpass);
  return { type: 'FeatureCollection', features } as GeoJSON.FeatureCollection;
};

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
      style.sources.climbing = emptyGeojsonSource;
      style.layers.push(...climbingLayers); // must be also in `layersWithOsmId` because of hover effect
      fetchCrags().then((geojson) => {
        const geojsonSource = map.getSource('climbing') as GeoJSONSource;
        geojsonSource?.setData(geojson); // TODO can be undefined at first map render
      });
    }
  });

  map.setStyle(style, { diff: true });
});
