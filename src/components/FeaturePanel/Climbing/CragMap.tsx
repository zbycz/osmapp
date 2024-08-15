import React, { useCallback, useEffect } from 'react';
import maplibregl, { GeoJSONSource } from 'maplibre-gl';
import { outdoorStyle } from '../../Map/styles/outdoorStyle';
import { COMPASS_TOOLTIP } from '../../Map/useAddTopRightControls';
import { PersistedScaleControl } from '../../Map/behaviour/PersistedScaleControl';
import styled from '@emotion/styled';
import { useFeatureContext } from '../../utils/FeatureContext';
import type { LayerSpecification } from '@maplibre/maplibre-gl-style-spec';
import { useMobileMode } from '../../helpers';

const Container = styled.div`
  height: 100%;
`;

const emptyGeojson = {
  type: 'geojson' as const,
  data: {
    type: 'FeatureCollection' as const,
    features: [],
  },
};

export const routes: LayerSpecification[] = [
  {
    id: 'climbing-3-routes-circle',
    type: 'circle',
    source: 'climbing',

    paint: {
      'circle-color': [
        'case',
        ['boolean', ['feature-state', 'hover'], false],
        '#4150a0',
        '#ea5540',
      ],
      'circle-radius': 4,
    },
  } as LayerSpecification,
  {
    id: 'climbing-3-routes-labels',
    type: 'symbol',
    source: 'climbing',
    layout: {
      'text-padding': 2,
      'text-font': ['Noto Sans Medium'],
      'text-anchor': 'left',
      'text-field': '{name} {climbing:grade:uiaa}',
      'text-offset': [1, 0],
      'text-size': 14,
      'text-max-width': 9,
      'text-allow-overlap': false,
      'text-optional': true,
    },
    paint: {
      'text-halo-blur': 0.5,
      'text-color': '#666',
      'text-halo-width': 1,
      'text-halo-color': '#ffffff',
    },
  },
];

const geolocation = new maplibregl.GeolocateControl({
  positionOptions: {
    enableHighAccuracy: true,
  },
  fitBoundsOptions: {
    duration: 4000,
  },
  trackUserLocation: true,
});

const navigation = {
  mobile: new maplibregl.NavigationControl({
    showZoom: false,
    showCompass: true,
    visualizePitch: true,
  }),
  desktop: new maplibregl.NavigationControl({
    showZoom: true,
    showCompass: true,
    visualizePitch: true,
  }),
};

const useInitMap = () => {
  const mapRef = React.useRef(null);
  const mobileMode = useMobileMode();
  const [mapInState, setMapInState] = React.useState(null);

  const navControl = mobileMode ? navigation.mobile : navigation.desktop;

  React.useEffect(() => {
    if (!mapRef.current) return undefined;

    const map = new maplibregl.Map({
      container: mapRef.current,
      style: {
        ...outdoorStyle,
        layers: [...outdoorStyle.layers, ...routes],
        sources: { ...outdoorStyle.sources, climbing: emptyGeojson },
      },
      attributionControl: false,
      refreshExpiredTiles: false,
      locale: {
        'NavigationControl.ResetBearing': COMPASS_TOOLTIP,
      },
    });
    setMapInState(map);

    map.addControl(navControl);
    map.addControl(PersistedScaleControl as any);
    map.addControl(geolocation);

    map.scrollZoom.setWheelZoomRate(1 / 200); // 1/450 is default, bigger value = faster

    return () => {
      if (map) {
        map.remove();
        map.removeControl(navControl);
        map.removeControl(geolocation);
      }
    };
  }, [mapRef, navControl]);

  return [mapInState, mapRef];
};

const transformMemberFeaturesToGeojson = (features) => {
  return features.map((feature) => ({
    ...feature,
    properties: { ...feature.properties, name: feature.tags.name },
    geometry:
      feature.osmMeta.type === 'node'
        ? { coordinates: feature.center, type: 'Point' }
        : undefined,
  }));
};

const CragMap = () => {
  const [map, mapRef] = useInitMap();
  const { feature } = useFeatureContext();

  const getClimbingSource = useCallback(
    () => map.getSource('climbing') as GeoJSONSource | undefined,
    [map],
  );

  useEffect(() => {
    if (map) {
      map.jumpTo({ center: feature.center, zoom: 19 });

      getClimbingSource()?.setData({
        type: 'FeatureCollection' as const,
        features: transformMemberFeaturesToGeojson(feature.memberFeatures),
      });
    }
  }, [feature.center, feature.memberFeatures, getClimbingSource, map]);

  return (
    <Container>
      <div ref={mapRef} style={{ height: '100%', width: '100%' }} />
    </Container>
  );
};

export default CragMap;
