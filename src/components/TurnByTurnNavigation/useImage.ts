import { GeoJSONSource, Map } from 'maplibre-gl';
import { useLocation, useOrientation } from './helpers';
import React from 'react';

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

export const useLocationImage = (map: Map) => {
  const location = useLocation();
  const { coords } = location ?? {
    coords: { longitude: null, latitude: null },
  };
  const { longitude, latitude } = coords;
  const { alpha, webkitCompassHeading } = useOrientation();

  React.useEffect(() => {
    (async () => {
      if (longitude === null) {
        return;
      }
      if (latitude === null) {
        return;
      }
      if (!map.hasImage(IMAGE_ID)) {
        const img = await map.loadImage('/directionalArrow.png');
        map.addImage(IMAGE_ID, img.data);
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
    })();
  }, [latitude, longitude, map, alpha, webkitCompassHeading]);
};
