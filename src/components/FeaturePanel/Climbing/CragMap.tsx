import React, { useCallback, useState } from 'react';
import maplibregl, { GeoJSONSource } from 'maplibre-gl';
import { outdoorStyle } from '../../Map/styles/outdoorStyle';
import { COMPASS_TOOLTIP } from '../../Map/useAddTopRightControls';
import styled from '@emotion/styled';
import { useFeatureContext } from '../../utils/FeatureContext';
import type { LayerSpecification } from '@maplibre/maplibre-gl-style-spec';
import { CircularProgress } from '@mui/material';

const Map = styled.div<{ $isVisible: boolean }>`
  visibility: ${({ $isVisible }) => ($isVisible ? 'visible' : 'hidden')};
  height: 100%;
  width: 100%;
`;

const LoadingContainer = styled.div`
  height: 100%;
  width: 100%;
  position: absolute;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const Container = styled.div`
  width: 100%;
  height: 100%;
  position: relative;
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
      'text-field': '{name} {grade}',
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

const useInitMap = () => {
  const containerRef = React.useRef(null);
  const mapRef = React.useRef<maplibregl.Map>(null);
  const [isMapLoaded, setIsMapLoaded] = useState(false);
  const { feature } = useFeatureContext();

  const getClimbingSource = useCallback(
    () => mapRef.current.getSource('climbing') as GeoJSONSource | undefined,
    [],
  );

  React.useEffect(() => {
    const geolocation = new maplibregl.GeolocateControl({
      positionOptions: {
        enableHighAccuracy: true,
      },
      fitBoundsOptions: {
        duration: 4000,
      },
      trackUserLocation: true,
    });

    setIsMapLoaded(false);
    if (!containerRef.current) return undefined;
    const map = new maplibregl.Map({
      container: containerRef.current,
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

    map.scrollZoom.setWheelZoomRate(1 / 200); // 1/450 is default, bigger value = faster
    map.addControl(geolocation);
    mapRef.current = map;

    mapRef.current.on('load', () => {
      setIsMapLoaded(true);
      if (mapRef.current) {
        mapRef.current.jumpTo({
          center: feature.center as [number, number],
          zoom: 18.5,
        });

        getClimbingSource()?.setData({
          type: 'FeatureCollection' as const,
          features: transformMemberFeaturesToGeojson(feature.memberFeatures),
        });
      }
    });

    return () => {
      if (map) {
        map.remove();
      }
    };
  }, [containerRef, feature.center, feature.memberFeatures, getClimbingSource]);

  return { containerRef, isMapLoaded };
};

const transformMemberFeaturesToGeojson = (features) => {
  return features.map((feature) => ({
    ...feature,
    properties: {
      ...feature.properties,
      name: feature.tags.name,
      grade: feature.tags['climbing:grade:uiaa'],
    },
    geometry:
      feature.osmMeta.type === 'node'
        ? { coordinates: feature.center, type: 'Point' }
        : undefined,
  }));
};

const CragMap = () => {
  const { containerRef, isMapLoaded } = useInitMap();

  return (
    <Container>
      {!isMapLoaded && (
        <LoadingContainer>
          <CircularProgress color="primary" />
        </LoadingContainer>
      )}
      <Map $isVisible={isMapLoaded} ref={containerRef} />
    </Container>
  );
};

export default CragMap; // dynamic import
