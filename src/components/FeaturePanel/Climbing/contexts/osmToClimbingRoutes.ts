import { Feature, FeatureTags } from '../../../../services/types';
import {
  ClimbingRoute,
  PathPoints,
  PointType,
  RouteDifficulty,
} from '../types';
import { getUrlOsmId } from '../../../../services/helpers';
import { GradeSystem } from '../utils/gradeTable';

const boltCodeMap: Record<string, PointType> = {
  B: 'bolt',
  A: 'anchor',
  P: 'piton',
  S: 'sling',
};

const parsePathString = (pathString?: string): PathPoints =>
  pathString
    ?.split('|')
    .map((coords) => coords.split(',', 2))
    .map(([x, y]) => ({
      x: parseFloat(x),
      y: parseFloat(y),
      units: 'percentage' as const,
      type: boltCodeMap[y.slice(-1)],
    }));
// TODO filter( where x and y are really numbers)

const parseImageTag = (value: string) => {
  const [image, pathString] = value?.split('#', 2) ?? [];
  return { image, points: parsePathString(pathString) };
};

const getPathsByImage = (tags: FeatureTags) => {
  const climbingImages = Object.keys(tags).filter((key) =>
    key.startsWith('climbing:image'),
  );

  const out = {};

  climbingImages.forEach((key) => {
    const { image, points } = parseImageTag(tags[key]);
    if (image) {
      out[image] = points;
    }
  });

  return out;
};

const getDifficulty = (tags: FeatureTags): RouteDifficulty | undefined => {
  const gradeKeys = Object.keys(tags).filter((key) =>
    key.startsWith('climbing:grade'),
  );

  if (gradeKeys.length) {
    const key = gradeKeys[0]; // TODO store all found grades
    const system = key.split(':', 3)[2];

    return {
      gradeSystem: (system ?? 'uiaa') as GradeSystem, // TODO `gradeSystem` type should be `string`
      grade: tags[key],
    };
  }

  return undefined;
};

export const osmToClimbingRoutes = (feature: Feature): Array<ClimbingRoute> => {
  if (!feature.memberFeatures) {
    return [];
  }

  const routes = feature.memberFeatures.filter(({ tags }) =>
    ['route', 'route_bottom'].includes(tags.climbing),
  );

  return routes.map((route) => ({
    id: getUrlOsmId(route.osmMeta),
    length: route.tags['climbing:length'],
    name: route.tags.name,
    description: route.tags.description,
    difficulty: getDifficulty(route.tags),
    paths: getPathsByImage(route.tags),
  }));
};
