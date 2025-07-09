import { GeojsonFeature } from './overpass/overpassToGeojsons';
import { LineString, LonLat, Point } from '../../services/types';
import { ClimbingFeaturesRecords } from './db';
import { CTFeature } from '../../types';

export const centerGeometry = (
  feature: GeojsonFeature,
): GeojsonFeature<Point> => ({
  ...feature,
  geometry: {
    type: 'Point',
    coordinates: feature.center,
  },
});

const firstPointGeometry = (
  feature: GeojsonFeature<LineString>,
): GeojsonFeature<Point> => ({
  ...feature,
  geometry: {
    type: 'Point',
    coordinates: feature.geometry.coordinates[0],
  },
});

const prepareGeojson = (
  type: string,
  { id, geometry, properties }: GeojsonFeature,
): CTFeature => ({
  type: 'Feature',
  id,
  geometry,
  properties: { ...properties, type },
});

const removeDiacritics = (str: string) =>
  str?.normalize('NFD').replace(/[\u0300-\u036f]/g, '');

export const recordsFactory = (log: (message: string) => void) => {
  const records: ClimbingFeaturesRecords = [];
  const addRecordRaw = (
    type: string,
    coordinates: LonLat,
    feature: GeojsonFeature,
  ) => {
    if (!coordinates) {
      log(`Skipping record without geometry, mapid: ${feature.id}`);
      return;
    }

    const [lon, lat] = coordinates;
    records.push({
      type,
      osmType: feature.osmMeta.type,
      osmId: feature.osmMeta.id,
      name: feature.tags.name,
      nameRaw: removeDiacritics(feature.tags.name),
      count: feature.properties.osmappRouteCount || 0,
      lon,
      lat,
      geojson: prepareGeojson(type, feature),
    });
  };

  const addRecord = (type: string, feature: GeojsonFeature<Point>) => {
    addRecordRaw(type, feature.geometry.coordinates, feature);
  };

  const addRecordWithLine = (type: string, way: GeojsonFeature<LineString>) => {
    addRecord(type, firstPointGeometry(way));
    addRecordRaw(type, way.center, way);
  };

  return { records, addRecord, addRecordWithLine };
};

export const buildLogFactory = () => {
  const buildLog: string[] = [];
  const log = (message: string) => {
    buildLog.push(message);
    console.log(message); //eslint-disable-line no-console
  };
  log('Starting...');
  return { getBuildLog: () => buildLog.join('\n'), log };
};
