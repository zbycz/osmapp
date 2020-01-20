// @flow

import * as React from 'react';
import mapboxgl from 'mapbox-gl'; // update CSS import in _document.js
import { getSkeleton } from './helpers';
import { fetchFromApi } from '../../services/osmApi';
import { hoverLayers, style } from './layers';
import { useMapEffectFactory } from '../helpers';

// mapboxgl.accessToken = 'pk.eyJ1IjoiemJ5Y3oiLCJhIjoiY2oxMGN4enAxMDAyZjMybXF5eGJ5M2lheCJ9.qjvbRJ2C1tL4O9g9jOdJIw';
const geolocateControl = new mapboxgl.GeolocateControl({
  positionOptions: {
    enableHighAccuracy: true,
  },
  trackUserLocation: true,
});
const scaleControl = new mapboxgl.ScaleControl({
  maxWidth: 80,
  unit: window.localStorage.getItem('units') ? 'imperial' : 'metric',
});

const useInitMap = () => {
  const mapRef = React.useRef(null);
  const [mapInState, setMapInState] = React.useState(null);

  React.useEffect(() => {
    if (!mapRef.current) return;

    const map = new mapboxgl.Map({
      container: mapRef.current,
      style,
      center: [14.38906, 50.10062],
      zoom: 17,
      attributionControl: false,
    });
    setMapInState(map);

    map.addControl(geolocateControl);
    map.addControl(scaleControl);

    let lastHover = null;
    const setHover = (f, hover) => f && map.setFeatureState(f, { hover });
    const setHoverOn = f => setHover(f, true);
    const setHoverOff = f => setHover(f, false);
    const onMouseMove = e => {
      if (e.features && e.features.length > 0) {
        const feature = e.features[0];
        if (feature !== lastHover) {
          setHoverOff(lastHover);
          setHoverOn(feature);
          lastHover = feature;
          map.getCanvas().style.cursor = 'pointer';
        }
      }
    };
    const onMouseLeave = () => {
      setHoverOff(lastHover);
      lastHover = null;
      map.getCanvas().style.cursor = ''; // TODO delay 200ms
    };

    hoverLayers.forEach(x => {
      map.on('mousemove', x, onMouseMove);
      map.on('mouseleave', x, onMouseLeave);
    });
  }, [mapRef]);

  return [mapInState, mapRef];
};

const useOnFeatureClicked = useMapEffectFactory((map, onFeatureClicked) => {
  map.on('click', async e => {
    const point = e.point;
    const coords = map.unproject(point).toArray();
    const features = map.queryRenderedFeatures(point);
    if (!features.length) {
      return;
    }

    const skeleton = getSkeleton(features[0]);
    console.log(`clicked skeleton: `, skeleton); // eslint-disable-line no-console

    if (skeleton.nonOsmObject) {
      onFeatureClicked(skeleton);
    } else {
      onFeatureClicked({ ...skeleton, loading: true });
      onFeatureClicked(await fetchFromApi(skeleton.osmMeta));
    }
  });
});

const useOnMapLoaded = useMapEffectFactory((map, onMapLoaded) => {
  map.on('load', onMapLoaded);
});

const BrowserMap = ({ onFeatureClicked, onMapLoaded }) => {
  const [map, mapRef] = useInitMap();
  useOnFeatureClicked(map, onFeatureClicked);
  useOnMapLoaded(map, onMapLoaded);

  return <div ref={mapRef} style={{ height: '100%', width: '100%' }} />;
};

export default BrowserMap;
