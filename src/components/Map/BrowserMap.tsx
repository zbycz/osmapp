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
import { supports3d, webglSupported } from './helpers';
import { useOnMapLongPressed } from './behaviour/useOnMapLongPressed';
import { useAddTopRightControls } from './useAddTopRightControls';
import isNumber from 'lodash/isNumber';

const useOnMapLoaded = createMapEventHook<'load', [MapEventHandler<'load'>]>(
  (_, onMapLoaded) => ({
    eventType: 'load',
    eventHandler: onMapLoaded,
  }),
);

const useUpdateMap = createMapEffectHook<[View, number, number, string[]]>(
  (map, viewForMap, pitch, bearing, activeLayers) => {
    const center: [number, number] = [
      parseFloat(viewForMap[2]),
      parseFloat(viewForMap[1]),
    ];

    // flyTo makes the map unusable
    map.jumpTo({
      center,
      zoom: parseFloat(viewForMap[0]),
      ...(supports3d(activeLayers) && isNumber(pitch) ? { pitch } : {}),
      ...(supports3d(activeLayers) && isNumber(bearing) ? { bearing } : {}),
    });
  },
);

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
  const { setFeature, setAccessMethod } = useFeatureContext();
  const { mapLoaded, setMapLoaded } = useMapStateContext();

  const [map, mapRef] = useInitMap();
  useAddTopRightControls(map, mobileMode);
  useOnMapClicked(map, setFeature, setAccessMethod);
  useOnMapLongPressed(map, setFeature);
  useOnMapLoaded(map, setMapLoaded);
  useFeatureMarker(map);

  const {
    viewForMap,
    setViewFromMap,
    setBbox,
    activeLayers,
    landmarkPitch,
    landmarkBearing,
  } = useMapStateContext();
  useUpdateViewOnMove(map, setViewFromMap, setBbox);
  useToggleTerrainControl(map);
  useUpdateMap(map, viewForMap, landmarkPitch, landmarkBearing, activeLayers);
  useUpdateStyle(map, activeLayers, userLayers, mapLoaded);

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
