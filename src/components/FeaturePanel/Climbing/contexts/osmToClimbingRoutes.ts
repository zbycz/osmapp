import { Feature, FeatureTags } from '../../../../services/types';
import { ClimbingRoute, PathPoints } from '../types';
import { getUrlOsmId } from '../../../../services/helpers';

const parsePathString = (pathString?: string): PathPoints =>
  pathString
    ?.split('|')
    .map((coords) => coords.split(',', 2))
    .map(([x, y]) => ({
      x: parseFloat(x),
      y: parseFloat(y),
      units: 'percentage' as const,
    }));
// TODO filter( where x and y are really numbers)

const parseImageTag = (value: string) => {
  const [image, pathString] = value?.split('#', 2) ?? [];
  return { image, points: parsePathString(pathString) };
};

function getPathsByImage(tags: FeatureTags) {
  const { image, points } = parseImageTag(tags['climbing:image']);
  // TODO parse all tags starting with `climbing:image*`

  if (image) {
    return { [image]: points };
  }
  return {};
}

export const osmToClimbingRoutes = (feature: Feature): Array<ClimbingRoute> => {
  if (!feature.memberFeatures) return [];
  const routes = feature.memberFeatures.filter(({ tags }) =>
    ['route', 'route_bottom'].includes(tags.climbing),
  );
  return routes.map((route) => ({
    id: getUrlOsmId(route.osmMeta),
    length: route.tags['climbing:length'],
    name: route.tags.name,
    description: route.tags.description,
    paths: getPathsByImage(route.tags),
  }));
};
