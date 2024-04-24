import { Feature, FeatureTags } from '../../../../services/types';
import {
  ClimbingRoute,
  GradeSystem,
  PathPoints,
  RouteDifficulty,
} from '../types';
import { getUrlOsmId } from '../../../../services/helpers';
import { boltCodeMap } from '../utils/boltCodes';

const parsePathString = (pathString?: string): PathPoints =>
  pathString
    ?.split('|')
    .map((coords) => coords.split(',', 2))
    .map(([x, y]) => ({
      x: parseFloat(x),
      y: parseFloat(y),
      units: 'percentage' as const,
      type: boltCodeMap[y.slice(-1)],
    })) ?? [];
// @TODO filter( where x and y are really numbers)

const getPathsByImage = (tags: FeatureTags) => {
  const keys = Object.keys(tags).filter((key) =>
    key.match(/^wikimedia_commons:?\d*$/),
  );

  const paths = {};
  const photoToKeyMap = {};

  keys.forEach((key) => {
    const image = tags[key]?.replace(/^File:/, '');
    const path = tags[`${key}:path`];

    const points = parsePathString(path);
    paths[image] = points;
    photoToKeyMap[image] = key;
  });

  return { photoToKeyMap, paths };
};

const getDifficulty = (tags: FeatureTags): RouteDifficulty | undefined => {
  const gradeKeys = Object.keys(tags).filter((key) =>
    key.startsWith('climbing:grade'),
  );

  if (gradeKeys.length) {
    const key = gradeKeys[0]; // @TODO store all found grades
    const system = key.split(':', 3)[2];

    return {
      gradeSystem: (system ?? 'uiaa') as GradeSystem, // @TODO `gradeSystem` type should be `string`
      grade: tags[key],
    };
  }

  return undefined;
};

export const osmToClimbingRoutes = (feature: Feature): Array<ClimbingRoute> => {
  if (!feature.memberFeatures) {
    return [];
  }

  const routes = feature.memberFeatures;

  return routes.map((route) => {
    const { paths, photoToKeyMap } = getPathsByImage(route.tags);
    return {
      id: getUrlOsmId(route.osmMeta),
      length: route.tags['climbing:length'],
      name: route.tags.name,
      description: route.tags.description,
      difficulty: getDifficulty(route.tags),
      paths,
      photoToKeyMap,
      feature: route,
    };
  });
};
