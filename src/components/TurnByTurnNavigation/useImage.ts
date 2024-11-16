import { GeoJSONSource, Map } from 'maplibre-gl';
import { useLocation, useOrientation } from './helpers';
import React from 'react';
import { useQuery } from 'react-query';

const SOURCE = 'image-source';
const IMAGE_ID = 'nav-image';

const getSource = (map: Map) => {
  if (map.getSource(SOURCE)) {
    return map.getSource<GeoJSONSource>(SOURCE);
  }

  map.addSource(SOURCE, {
    type: 'geojson',
    data: {
      type: 'FeatureCollection',
      features: [],
    },
  });
  map.addLayer({
    id: `${SOURCE}-img`,
    type: 'symbol',
    source: SOURCE,
    layout: {
      'icon-image': IMAGE_ID,
      'icon-size': 0.25,
    },
  });

  return map.getSource<GeoJSONSource>(SOURCE);
};

const loadImage = async (map: Map, imagePath: string) => {
  const img = await map.loadImage(imagePath);
  map.addImage(IMAGE_ID, img.data);
  return img.data;
};

export const useLocationImage = (map: Map) => {
  const location = useLocation();
  const { coords } = location ?? {
    coords: { longitude: null, latitude: null },
  };
  const { longitude, latitude } = coords;
  const { alpha, webkitCompassHeading } = useOrientation();

  const {
    data: imageData,
    isLoading,
    error,
  } = useQuery(
    'directionalArrowImage',
    () => loadImage(map, '/directionalArrow.png'),
    {
      enabled:
        (longitude !== null || latitude !== null) && !map.hasImage(IMAGE_ID),
    },
  );

  React.useEffect(() => {
    if (isLoading || error) {
      return;
    }

    if (longitude === null || latitude === null) {
      return;
    }

    const source = getSource(map);

    source.setData({
      type: 'FeatureCollection',
      features: [
        {
          type: 'Feature',
          geometry: {
            type: 'Point',
            coordinates: [longitude, latitude],
          },
          properties: {},
        },
      ],
    });

    const compassHeading = webkitCompassHeading ?? alpha;
    map.setLayoutProperty(
      `${SOURCE}-img`,
      'icon-rotate',
      compassHeading - map.getBearing(),
    );
  }, [
    latitude,
    longitude,
    map,
    alpha,
    webkitCompassHeading,
    imageData,
    isLoading,
    error,
  ]);

  React.useEffect(() => {
    return () => {
      if (map.hasImage(IMAGE_ID)) {
        map.removeImage(IMAGE_ID);
      }
      if (map.getSource(SOURCE)) {
        map.removeSource(SOURCE);
      }
    };
  }, [map]);
};
