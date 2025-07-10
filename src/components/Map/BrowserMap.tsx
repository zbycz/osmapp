import React from 'react';
import 'maplibre-gl/dist/maplibre-gl.css';
import { useMapStateContext, View } from '../utils/MapStateContext';
import {
  createMapEffectHook,
  createMapEventHook,
  MapEventHandler,
  useMobileMode,
} from '../helpers';
import { useFeatureContext } from '../utils/FeatureContext';
import { useFeatureMarker } from './behaviour/useFeatureMarker';
import { useOnMapClicked } from './behaviour/useOnMapClicked';
import { useUpdateViewOnMove } from './behaviour/useUpdateViewOnMove';
import { useUpdateStyle } from './behaviour/useUpdateStyle';
import { useInitMap } from './behaviour/useInitMap';
import { Translation } from '../../services/intl';
import { useToggleTerrainControl } from './behaviour/useToggleTerrainControl';
import { webglSupported } from './helpers';
import { useOnMapLongPressed } from './behaviour/useOnMapLongPressed';
import { useAddTopRightControls } from './useAddTopRightControls';
import { usePersistedScaleControl } from './behaviour/PersistedScaleControl';
import { useUserThemeContext } from '../../helpers/theme';
import { useSnackbar } from '../utils/SnackbarContext';

const useOnMapLoaded = createMapEventHook<'load', [MapEventHandler<'load'>]>(
  (_, onMapLoaded) => ({
    eventType: 'load',
    eventHandler: onMapLoaded,
  }),
);

const useUpdateMap = createMapEffectHook<[View]>((map, viewForMap) => {
  const center: [number, number] = [
    parseFloat(viewForMap[2]),
    parseFloat(viewForMap[1]),
  ];
  map.jumpTo({ center, zoom: parseFloat(viewForMap[0]) });
});

const NotSupportedMessage = () => (
  <span
    style={{ position: 'absolute', left: '48%', top: '48%', maxWidth: '350px' }}
  >
    <Translation id="webgl_error" />
  </span>
);

// TODO #460 https://cdn.klokantech.com/openmaptiles-language/v1.0/openmaptiles-language.js + use localized name in FeaturePanel

const BrowserMap = () => {
  const { userLayers } = useMapStateContext();
  const mobileMode = useMobileMode();
  const { setFeature } = useFeatureContext();
  const { mapLoaded, setMapLoaded, mapClickOverrideRef } = useMapStateContext();
  const { currentTheme } = useUserThemeContext();

  const [map, mapRef] = useInitMap();
  useAddTopRightControls(map, mobileMode);
  useOnMapClicked(map, setFeature, mapClickOverrideRef);
  useOnMapLongPressed(map, setFeature);
  useOnMapLoaded(map, setMapLoaded);
  useFeatureMarker(map);

  const { viewForMap, setViewFromMap, setBbox, activeLayers } =
    useMapStateContext();
  useUpdateViewOnMove(map, setViewFromMap, setBbox);
  useToggleTerrainControl(map);
  useUpdateMap(map, viewForMap);
  useUpdateStyle(map, activeLayers, userLayers, mapLoaded, currentTheme);
  usePersistedScaleControl(map);

  return <div ref={mapRef} style={{ height: '100%', width: '100%' }} />;
};

const BrowserMapCheck = () => {
  const { setMapLoaded } = useMapStateContext();

  if (!webglSupported) {
    setMapLoaded();
    return <NotSupportedMessage />;
  }

  return <BrowserMap />;
};

export default BrowserMapCheck; // dynamic import
