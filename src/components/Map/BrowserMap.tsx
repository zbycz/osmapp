import React from 'react';
import 'maplibre-gl/dist/maplibre-gl.css';
import {
  createMapEffectHook,
  createMapEventHook,
  useMobileMode,
} from '../helpers';
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
import { useOnMapLongPressed } from './behaviour/useOnMapLongPressed';
import { useAddTopRightControls } from './useAddTopRightControls';

const useOnMapLoaded = createMapEventHook((map, onMapLoaded) => ({
  eventType: 'load',
  eventHandler: onMapLoaded,
}));

const useUpdateMap = createMapEffectHook((map, viewForMap) => {
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

const BrowserMap = ({ onMapLoaded }) => {
  if (!isWebglSupported()) {
    onMapLoaded();
    return <NotSupportedMessage />;
  }

  const mobileMode = useMobileMode();
  const { setFeature, setPreview } = useFeatureContext();
  const [map, mapRef] = useInitMap();
  useAddTopRightControls(map, mobileMode);
  useOnMapClicked(map, setFeature, setPreview, mobileMode);
  useOnMapLongPressed(map, setPreview);
  useOnMapLoaded(map, onMapLoaded);
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
