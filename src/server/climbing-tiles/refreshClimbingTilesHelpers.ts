import { FeatureTags, LineString, LonLat, Point } from '../../services/types';
import { ClimbingFeaturesRecord } from './db';
import { removeDiacritics } from './utils';
import { getDifficulty } from '../../services/tagging/climbing/routeGrade';
import { GRADE_TABLE } from '../../services/tagging/climbing/gradeData';
import { encodeHistogram } from './overpass/histogram';
import { GeojsonFeature } from './overpass/types';

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

const getNameWithDifficulty = (tags: FeatureTags) => {
  if (tags.climbing?.startsWith('route')) {
    const gradeKey = Object.keys(tags).find((key) =>
      key.match(/^climbing:grade:[^:]+$/),
    );
    const grade = gradeKey ? tags[gradeKey] : '';
    return `${tags.name ?? ''}${grade ? ` ${grade}` : ''}`;
  }

  return tags.name ?? null;
};

const getRouteGradeIndex = (tags: FeatureTags) => {
  if (tags?.climbing?.startsWith('route')) {
    const difficulty = getDifficulty(tags);
    if (!difficulty) {
      return null;
    }
    const { gradeSystem, grade } = difficulty;
    const grades = GRADE_TABLE[gradeSystem];
    if (!grades) {
      return null;
    }
    const index = grades.indexOf(grade);
    return index >= 0 ? index : null;
  }

  return null;
};

export const recordsFactory = (log: (message: string) => void) => {
  const records: ClimbingFeaturesRecord[] = [];
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
    const name = getNameWithDifficulty(feature.tags);
    const gradeId = getRouteGradeIndex(feature.tags);

    const nameRaw = removeDiacritics(name);
    const record: ClimbingFeaturesRecord = {
      type,
      osmType: feature.osmMeta.type,
      osmId: feature.osmMeta.id,
      name: name === nameRaw ? null : name, // query length optimization
      nameRaw,
      routeCount: feature.properties.routeCount,
      hasImages: feature.properties.hasImages,
      gradeId,
      lon,
      lat,
      line:
        feature.geometry.type === 'LineString'
          ? (JSON.stringify(feature.geometry.coordinates) as unknown as any) // careful, pg and rest handles differently
          : null,
      histogramCode: encodeHistogram(feature.properties.histogram),
    };

    records.push(record);
  };

  const addRecord = (type: string, feature: GeojsonFeature<Point>) => {
    addRecordRaw(type, feature.geometry.coordinates, feature);
  };

  const addRecordWithLine = (type: string, way: GeojsonFeature<LineString>) => {
    addRecord(type, firstPointGeometry(way)); // TODO this may be optimized not to create two row but one with firstPoint coordinates + way geometry -> in geojson again construct two items (2800 records ~ 4% saved)
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
  log('Starting - fetching from overpass...');
  return { getBuildLog: () => buildLog.join('\n'), log };
};
