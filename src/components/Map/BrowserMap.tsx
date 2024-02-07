import React from 'react';
import 'maplibre-gl/dist/maplibre-gl.css';
import { useAddMapEvent, useMapEffect, useMobileMode } from '../helpers';
import { useMapStateContext } from '../utils/MapStateContext';
import { useFeatureContext } from '../utils/FeatureContext';
import { useFeatureMarker } from './behaviour/useFeatureMarker';
import { useOnMapClicked } from './behaviour/useOnMapClicked';
import { useUpdateViewOnMove } from './behaviour/useUpdateViewOnMove';
import { useUpdateStyle } from './behaviour/useUpdateStyle';
import { useInitMap } from './behaviour/useInitMap';
import { Translation } from '../../services/intl';
import { useToggleTerrainControl } from './behaviour/useToggleTerrainControl';
import { isWebglSupported } from './helpers';
import { fetchJson } from '../../services/fetch';
import { overpassGeomToGeojson } from '../../services/overpassSearch';

const useOnMapLoaded = useAddMapEvent((map, onMapLoaded) => ({
  eventType: 'load',
  eventHandler: onMapLoaded,
}));

const useUpdateMap = useMapEffect((map, viewForMap) => {
  const center = [viewForMap[2], viewForMap[1]];
  map.jumpTo({ center, zoom: viewForMap[0] });
});

const NotSupportedMessage = () => (
  <span
    style={{ position: 'absolute', left: '48%', top: '48%', maxWidth: '350px' }}
  >
    <Translation id="webgl_error" />
  </span>
);

// TODO https://cdn.klokantech.com/openmaptiles-language/v1.0/openmaptiles-language.js + use localized name in FeaturePanel

const fetchCrags = async () => {
  const query = `[out:json][timeout:25];(relation["climbing"="crag"](48,11,51,19););out geom qt;`;
  const data = encodeURIComponent(query);
  const url = `https://overpass-api.de/api/interpreter?data=${data}`;
  const overpass = await fetchJson(url);
  const features = overpassGeomToGeojson(overpass);
  return { type: 'FeatureCollection', features };
};

const BrowserMap = ({ onMapLoaded }) => {
  if (!isWebglSupported()) {
    onMapLoaded();
    return <NotSupportedMessage />;
  }

  const { setFeature, setPreview } = useFeatureContext();
  const [map, mapRef] = useInitMap();
  useOnMapClicked(map, setFeature, setPreview, useMobileMode());
  useOnMapLoaded(map, onMapLoaded);
  useOnMapLoaded(map, async () => {
    map.getSource('overpass')?.setData(await fetchCrags());
  });
  useFeatureMarker(map);

  const { viewForMap, setViewFromMap, setBbox, activeLayers } =
    useMapStateContext();
  useUpdateViewOnMove(map, setViewFromMap, setBbox);
  useToggleTerrainControl(map);
  useUpdateMap(map, viewForMap);
  useUpdateStyle(map, activeLayers);

  return <div ref={mapRef} style={{ height: '100%', width: '100%' }} />;
};

export default BrowserMap;
