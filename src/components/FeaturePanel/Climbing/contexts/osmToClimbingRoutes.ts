import { Feature, FeatureTags } from '../../../../services/types';
import { ClimbingRoute, PathPoints } from '../types';
import { getUrlOsmId } from '../../../../services/helpers';
import { boltCodeMap } from '../utils/boltCodes';
import { removeFilePrefix } from '../utils/photo';
import { getDifficulty } from '../utils/grades/routeGrade';
import { publishDbgObject } from '../../../../utils';

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
    const image = removeFilePrefix(tags[key]);
    const path = tags[`${key}:path`];

    const points = parsePathString(path);
    paths[image] = points;
    photoToKeyMap[image] = key;
  });

  return { photoToKeyMap, paths };
};

export const osmToClimbingRoutes = (feature: Feature): Array<ClimbingRoute> => {
  if (!feature.memberFeatures) {
    return [];
  }

  const routes = feature.memberFeatures;

  const climbingRoutes = routes.map((route) => {
    const { paths, photoToKeyMap } = getPathsByImage(route.tags);
    return {
      id: getUrlOsmId(route.osmMeta),
      length: route.tags['climbing:length'],
      name: route.tags.name,
      difficulty: getDifficulty(route.tags),
      paths,
      photoToKeyMap,
      author: route.tags.author,
      updatedTags: { ...route.tags },
      feature: route,
    } as ClimbingRoute;
  });

  publishDbgObject('climbingRoutes', climbingRoutes);

  return climbingRoutes;
};
