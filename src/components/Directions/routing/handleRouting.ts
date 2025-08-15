import { getDistance } from '../../SearchBox/utils';
import { getGlobalMap, mapIdlePromise } from '../../../services/mapStorage';
import maplibregl from 'maplibre-gl';
import { LonLat } from '../../../services/types';
import { Profile, RoutingResult } from './types';
import { getGraphhopperResults } from './getGraphhopperResults';
import { LineLayerSpecification } from '@maplibre/maplibre-gl-style-spec';
import { isMobileModeVanilla } from '../../helpers';

// taken from or inspired by cartes.app, LGPL

const slopeColor = (slope) => {
  if (slope < 0) return '#8f53c1'; // give another color for negative slopes ?
  if (slope < 3) return '#8f53c1';
  // if (slope < 5) return 'yellow';
  if (slope < 7.5) return 'orange';
  if (slope < 12) return 'OrangeRed';
  return 'crimson';
};

const computeSlopeGradient = (geojson) => {
  const coordinates = geojson.features[0].geometry.coordinates;
  const distanceColors = coordinates
    .slice(0, -1)
    .map(([lon, lat, meters], i) => {
      const distance = getDistance([lon, lat], coordinates[i + 1]);
      const elevationDifference = coordinates[i + 1][2] - meters;

      const slope = 100 * (elevationDifference / distance);

      return [distance, elevationDifference];
    });

  // Slopes are quite erratic. We're getting e.g. 16 % for 1.5m at 0.25 of diff,
  // then 0 % for 20 m
  // hence the need to average
  // We can do it every 10 meters
  // Algo : we're splitting to 1m bits, disregarding the possibility that some
  // semgents are < 1m
  // Then averaging them to 10 m segments
  // It's not very efficient but we don't care for this kind of load, feel free :)

  const totalDistance = distanceColors.reduce(
    (memo, next) => memo + next[0],
    0,
  );

  const littles = distanceColors
    .map(([distance, elevationDifference]) =>
      [...new Array(Math.round(distance))].map(
        (el) => (elevationDifference * 100) / Math.round(distance),
      ),
    )
    .flat();

  const chunkSize = 30;
  const averaged = [];
  for (let i = 0; i < littles.length; i += chunkSize) {
    const chunk = littles.slice(i, i + chunkSize);
    const sum = chunk.reduce((memo, next) => memo + next, 0);

    averaged.push(sum / chunkSize);
  }

  return averaged
    .map((slope, i) => [(i * chunkSize) / totalDistance, slopeColor(slope)])
    .flat();
};

const getPaint = (
  mode: Profile,
  result: RoutingResult,
): LineLayerSpecification['paint'] => {
  if (mode === 'walk') {
    return {
      'line-color': '#8f53c1',
      'line-width': 5,
    };
  }

  if (mode === 'car') {
    return {
      'line-width': 5,
      'line-color': 'IndianRed',
    };
  }

  if (mode === 'bike' && result.router.startsWith('BRouter')) {
    return {
      'line-color': '#57bff5',
      'line-width': 5,
      'line-gradient': [
        'interpolate',
        ['linear'],
        ['line-progress'],
        ...computeSlopeGradient(result.geojson),
      ],
    };
  }

  if (mode === 'bike') {
    return {
      'line-color': '#57bff5',
      'line-width': 5,
    };
  }
};

const ROUND_LINE = {
  'line-join': 'round',
  'line-cap': 'round',
} as const;

const SOURCE = 'routing';

const renderOnMap = (
  map: maplibregl.Map,
  result: RoutingResult,
  mode: Profile,
) => {
  destroyRouting();

  map.addSource(SOURCE, {
    type: 'geojson',
    data: result.geojson,
    lineMetrics: true,
  });

  map.addLayer({
    id: `${SOURCE}-line-casing`,
    type: 'line',
    source: SOURCE,
    layout: ROUND_LINE,
    paint: {
      'line-color': 'white',
      'line-width': 8,
    },
  });

  map.addLayer({
    id: `${SOURCE}-line`,
    type: 'line',
    source: SOURCE,
    layout: ROUND_LINE,
    paint: getPaint(mode, result),
  });
};

export const destroyRouting = () => {
  const map = getGlobalMap();
  if (map.getLayer(`${SOURCE}-line`)) {
    map.removeLayer(`${SOURCE}-line`);
  }
  if (map.getLayer(`${SOURCE}-line-casing`)) {
    map.removeLayer(`${SOURCE}-line-casing`);
  }
  if (map?.getSource(SOURCE)) {
    map.removeSource(SOURCE);
  }
};

const LAST_MODE_STORAGE_KEY = 'last-directions-mode';
export const getLastMode = () =>
  window.localStorage?.getItem(LAST_MODE_STORAGE_KEY) as Profile;

export const handleRouting = async (
  mode: Profile,
  points: LonLat[],
): Promise<RoutingResult> => {
  if (!mode || !points || points.length < 2) {
    return;
  }
  window.localStorage?.setItem(LAST_MODE_STORAGE_KEY, mode);

  const result = await getGraphhopperResults(mode, points);
  if (result == null) {
    return null;
  }

  const map = await mapIdlePromise;
  renderOnMap(map, result, mode);

  const { w, s, e, n } = result.bbox;
  const bbox = new maplibregl.LngLatBounds([w, s], [e, n]);
  const padding = isMobileModeVanilla()
    ? { left: 30, right: 30, bottom: 30, top: 120 }
    : { left: 390, right: 50, top: 50, bottom: 50 };

  const currentBounds = map.getBounds();
  if (
    !currentBounds.contains(bbox.getSouthWest()) ||
    !currentBounds.contains(bbox.getNorthEast())
  ) {
    map.fitBounds(bbox, { padding });
  }

  return result;
};
