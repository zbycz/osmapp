import { Feature, FeatureTags } from '../../../../services/types';
import { ClimbingRoute } from '../types';
import { getUrlOsmId } from '../../../../services/helpers';
import { removeFilePrefix } from '../utils/photo';
import { getDifficulty } from '../../../../services/tagging/climbing/routeGrade';
import { publishDbgObject } from '../../../../utils';
import { getDividedFeaturesBySections } from '../utils/getDividedFeaturesBySections';
import { parsePathString } from '../utils/pathUtils';

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

  const routes = getDividedFeaturesBySections(feature.memberFeatures).routes;

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
