import React from 'react';
import 'maplibre-gl/dist/maplibre-gl.css';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import { useAddMapEvent, useMapEffect } from '../helpers';
import { useMapStateContext } from '../utils/MapStateContext';
import { useFeatureContext } from '../utils/FeatureContext';
import { useFeatureMarker } from './behaviour/useFeatureMarker';
import { useOnMapClicked } from './behaviour/useOnMapClicked';
import { useUpdateViewOnMove } from './behaviour/useUpdateViewOnMove';
import { useUpdateStyle } from './behaviour/useUpdateStyle';
import { useInitMap } from './behaviour/useInitMap';

const useOnMapLoaded = useAddMapEvent((map, onMapLoaded) => ({
  eventType: 'load',
  eventHandler: onMapLoaded,
}));

const useUpdateMap = useMapEffect((map, viewForMap) => {
  const center = [viewForMap[2], viewForMap[1]];
  map.jumpTo({ center, zoom: viewForMap[0] });
});

export const useMobileMode = () => useMediaQuery('(max-width: 700px)');

// TODO https://cdn.klokantech.com/openmaptiles-language/v1.0/openmaptiles-language.js + use localized name in FeaturePanel

const BrowserMap = ({ onMapLoaded }) => {
  const { setFeature, setPreview } = useFeatureContext();
  const [map, mapRef] = useInitMap();
  useOnMapClicked(map, setFeature, setPreview, useMobileMode());
  useOnMapLoaded(map, onMapLoaded);
  useFeatureMarker(map);

  const { viewForMap, setViewFromMap, setBbox, activeLayers } =
    useMapStateContext();
  useUpdateViewOnMove(map, setViewFromMap, setBbox);
  useUpdateMap(map, viewForMap);
  useUpdateStyle(map, activeLayers);

  return <div ref={mapRef} style={{ height: '100%', width: '100%' }} />;
};

export default BrowserMap;
