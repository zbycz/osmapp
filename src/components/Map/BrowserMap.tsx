import React from 'react';
import maplibregl from 'maplibre-gl'; // update CSS import in _document.js
import throttle from 'lodash/throttle';
import Router from 'next/router';
import { getSkeleton } from './helpers';
import { setUpHover, style } from './layers';
import { useAddMapEvent, useMapEffect } from '../helpers';
import { useMapStateContext } from '../utils/MapStateContext';
import { getShortId, getUrlOsmId, isSameOsmId } from '../../services/helpers';
import { SHOW_PROTOTYPE_UI } from '../../config';
import { useFeatureContext } from '../utils/FeatureContext';
import { useFeatureMarker } from './useFeatureMarker';
import { addCenterFromMapToCache } from '../../services/osmApi';

const geolocateControl = new maplibregl.GeolocateControl({
  positionOptions: {
    enableHighAccuracy: true,
  },
  trackUserLocation: false,
});

const scaleControl = new maplibregl.ScaleControl({
  maxWidth: 80,
  unit: window.localStorage.getItem('units') ? 'imperial' : 'metric',
});

const navigationControl = new maplibregl.NavigationControl({
  showCompass: true,
  showZoom: true,
  visualizePitch: true,
});

const useInitMap = () => {
  const mapRef = React.useRef(null);
  const [mapInState, setMapInState] = React.useState(null);

  React.useEffect(() => {
    if (!mapRef.current) return undefined;

    const map = new maplibregl.Map({
      container: mapRef.current,
      style,
      attributionControl: false,
      refreshExpiredTiles: false,
    });
    setMapInState(map);

    map.addControl(navigationControl);
    map.addControl(geolocateControl);
    map.addControl(scaleControl);
    setUpHover(map);

    return () => {
      map.remove();
    };
  }, [mapRef]);

  return [mapInState, mapRef];
};

const useOnFeatureClicked = useAddMapEvent((map, setFeature) => ({
  eventType: 'click',
  eventHandler: async (e) => {
    const { point } = e;
    const coords = map.unproject(point).toArray();
    const features = map.queryRenderedFeatures(point);
    if (!features.length) {
      return;
    }

    const skeleton = getSkeleton(features[0], coords);
    addCenterFromMapToCache(getShortId(skeleton.osmMeta), skeleton.center);
    console.log('clicked skeleton: ', skeleton); // eslint-disable-line no-console

    if (!skeleton.nonOsmObject) {
      // router wouldnt overwrite the skeleton if the page is already loaded
      setFeature((feature) =>
        isSameOsmId(feature, skeleton) ? feature : skeleton,
      );
      addCenterFromMapToCache(getShortId(skeleton.osmMeta), skeleton.center);

      Router.push(`/${getUrlOsmId(skeleton.osmMeta)}`);
    } else if (SHOW_PROTOTYPE_UI) {
      setFeature(skeleton);
    }
  },
}));

const useOnMapLoaded = useAddMapEvent((map, onMapLoaded) => ({
  eventType: 'load',
  eventHandler: onMapLoaded,
}));

const useUpdateViewOnMove = useAddMapEvent((map, setViewFromMap, setBbox) => ({
  eventType: 'move',
  eventHandler: throttle(() => {
    setViewFromMap([
      map.getZoom().toFixed(2),
      map.getCenter().lat.toFixed(4),
      map.getCenter().lng.toFixed(4),
    ]);

    const b = map.getBounds();
    // <lon x1>,<lat y1>,<x2>,<y2>
    const bb = [b.getWest(), b.getNorth(), b.getEast(), b.getSouth()];
    setBbox(bb.map((x) => x.toFixed(5)));
  }, 2000),
}));

const useUpdateMap = useMapEffect((map, viewForMap) => {
  const center = [viewForMap[2], viewForMap[1]];
  console.log('map will jump to:', center); // eslint-disable-line no-console
  map.jumpTo({ center, zoom: viewForMap[0] });
});

// TODO https://cdn.klokantech.com/openmaptiles-language/v1.0/openmaptiles-language.js + use localized name in FeaturePanel

const BrowserMap = ({ onMapLoaded }) => {
  const { setFeature } = useFeatureContext();
  const [map, mapRef] = useInitMap();
  useOnFeatureClicked(map, setFeature);
  useOnMapLoaded(map, onMapLoaded);
  useFeatureMarker(map);

  const { viewForMap, setViewFromMap, setBbox } = useMapStateContext();
  useUpdateViewOnMove(map, setViewFromMap, setBbox);
  useUpdateMap(map, viewForMap);

  return <div ref={mapRef} style={{ height: '100%', width: '100%' }} />;
};

export default BrowserMap;
