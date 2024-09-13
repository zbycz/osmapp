import { getDistance } from '../SearchBox/utils';
import { getGlobalMap, loadedMapPromise } from '../../services/mapStorage';
import { fetchJson } from '../../services/fetch';
import { getBbox } from '../../services/getCenter';
import maplibregl from 'maplibre-gl';

// taken from or inspired by cartes.app, LGPL

const slopeColor = (slope) => {
  if (slope < 0) return '#8f53c1'; // give another color for negative slopes ?
  if (slope < 3) return '#8f53c1';
  if (slope < 5) return 'yellow';
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

  const chunkSize = 20;
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

const paints = (geojson) => ({
  walk: {
    'line-color': '#8f53c1',
    'line-width': 5,
  },
  car: {
    'line-width': 5,
    'line-color': 'IndianRed',
  },
  bike: {
    'line-color': '#57bff5',
    'line-width': 5,
    'line-gradient': [
      'interpolate',
      ['linear'],
      ['line-progress'],
      ...computeSlopeGradient(geojson),
    ],
  },
});

export const profiles = {
  car: 'car-fast',
  bike: 'trekking',
  walk: 'hiking-mountain',
};

const SOURCE = 'routing';
export const handleRouting = async (mode, from, to) => {
  if (!mode || !from || !to) {
    return;
  }

  const profile = profiles[mode];
  const url = `https://brouter.de/brouter?lonlats=${from}|${to}&profile=${profile}&alternativeidx=0&format=geojson`;
  const geojson = await fetchJson(url);
  console.log('Searched for', from, to, mode, geojson);

  const map = await loadedMapPromise;
  map.addSource(SOURCE, {
    type: 'geojson',
    data: geojson,
    lineMetrics: true,
  });
  map.addLayer({
    id: `${SOURCE}-line-casing`,
    type: 'line',
    source: SOURCE,
    paint: {
      'line-color': 'white',
      'line-width': 8,
    },
  });
  map.addLayer({
    id: `${SOURCE}-line`,
    type: 'line',
    source: SOURCE,
    paint: paints(geojson)[mode],
  });
  const { w, s, e, n } = getBbox(geojson.features[0].geometry.coordinates);
  const bbox = new maplibregl.LngLatBounds([w, s], [e, n]);
  const width = window.innerWidth;
  const padding =
    width > 1000
      ? { left: width / 4, right: width / 4, bottom: 50, top: 50 }
      : { left: 50, right: 50, top: 50, bottom: 50 };
  map.fitBounds(bbox, { padding });
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
