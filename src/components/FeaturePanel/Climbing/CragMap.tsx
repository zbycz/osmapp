import React, { useCallback, useEffect, useRef, useState } from 'react';
import maplibregl, { GeoJSONSource, LngLatLike, PointLike } from 'maplibre-gl';
import { outdoorStyle } from '../../Map/styles/outdoorStyle';
import { COMPASS_TOOLTIP } from '../../Map/useAddTopRightControls';
import styled from '@emotion/styled';
import { useFeatureContext } from '../../utils/FeatureContext';
import type { LayerSpecification } from '@maplibre/maplibre-gl-style-spec';
import { CircularProgress } from '@mui/material';
import { useClimbingContext } from './contexts/ClimbingContext';
import { addFilePrefix } from './utils/photo';
import ReactDOMServer from 'react-dom/server';
import { CameraMarker } from './CameraMarker';

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

const useGetPhotoExifs = (photoPaths) => {
  const [photoExifs, setPhotoExifs] = useState<
    Record<string, Record<string, any>>
  >({});
  useEffect(() => {
    async function fetchExifData(photos) {
      const encodedTitles = photos.map((t) => addFilePrefix(t)).join('|');
      const url = `https://commons.wikimedia.org/w/api.php?action=query&prop=imageinfo&iiprop=metadata&titles=${encodedTitles}&format=json&origin=*`;
      const response = await fetch(url);
      const data = await response.json();
      return data.query.pages;
    }

    fetchExifData(photoPaths).then((pages) => {
      const data = Object.values(pages).reduce<Record<string, any>>(
        (acc, item: any) => {
          const metadata = item?.imageinfo?.[0]?.metadata.reduce(
            (acc2, { name, value }) => ({ ...acc2, [name]: value }),
            {},
          );

          return {
            ...acc,
            [item.title]: metadata,
          };
        },
        {},
      );
      setPhotoExifs(data);
    });
  }, [photoPaths]);
  return photoExifs;
};

function parseFractionOrNumber(input) {
  if (input.includes('/')) {
    const [numerator, denominator] = input.split('/');
    return parseFloat(numerator) / parseFloat(denominator);
  } else {
    return parseFloat(input);
  }
}

const usePhotoMarkers = (photoExifs, mapRef) => {
  const { feature } = useFeatureContext();

  const getMarker = useCallback((index: number, azimuth: number | null) => {
    let svgElement;
    // const photoPath = Object.keys(photoExifs)[index];
    if (typeof window !== 'undefined' && typeof document !== 'undefined') {
      svgElement = document.createElement('div');
      svgElement.innerHTML = ReactDOMServer.renderToStaticMarkup(
        <CameraMarker
          width={30}
          index={index}
          azimuth={azimuth}
          onClick={() => {
            // @TODO onclick is not working
            // Router.push(
            //   `${getOsmappLink(feature)}/climbing/photo/${photoPath}${window.location.hash}`,
            // );
          }}
        />,
      );
    } else svgElement = undefined;

    return {
      color: 'salmon',
      element: svgElement,
      offset: [0, -10] as PointLike,
    };
  }, []);

  const markerRef = useRef<maplibregl.Marker>();

  useEffect(() => {
    Object.keys(photoExifs).map((key, index) => {
      const exifItems = photoExifs[key];

      if (exifItems && exifItems.GPSLongitude && exifItems.GPSLatitude) {
        const marker = getMarker(
          index,
          exifItems.GPSImgDirection
            ? parseFractionOrNumber(exifItems.GPSImgDirection)
            : null,
        );
        markerRef.current = new maplibregl.Marker(marker)
          .setLngLat([
            exifItems.GPSLongitude,
            exifItems.GPSLatitude,
          ] as LngLatLike)
          .addTo(mapRef.current);
      }
    });

    return () => {
      Object.keys(photoExifs).map((key) => {
        markerRef.current?.remove();
      });
    };
  }, [getMarker, mapRef, markerRef, photoExifs]);
};

const useInitMap = () => {
  const containerRef = React.useRef(null);
  const mapRef = React.useRef<maplibregl.Map>(null);
  const [isMapLoaded, setIsMapLoaded] = useState(false);
  const [isFirstMapLoad, setIsFirstMapLoad] = useState(true);

  const { feature } = useFeatureContext();
  const { photoPaths } = useClimbingContext();

  const photoExifs = useGetPhotoExifs(photoPaths);
  usePhotoMarkers(photoExifs, mapRef);

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
    });

    return () => {
      if (map) {
        map.remove();
      }
    };
  }, [containerRef]);

  useEffect(() => {
    mapRef.current?.on('load', () => {
      if (isFirstMapLoad) {
        mapRef.current.jumpTo({
          center: feature.center as [number, number],
          zoom: 18.5,
        });

        getClimbingSource()?.setData({
          type: 'FeatureCollection' as const,
          features: transformMemberFeaturesToGeojson(feature.memberFeatures),
        });
        setIsFirstMapLoad(false);
      }
    });
  }, [
    feature.center,
    feature.memberFeatures,
    getClimbingSource,
    isFirstMapLoad,
  ]);

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
