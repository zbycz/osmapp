import { Feature } from '../../../../services/types';

const allowedValues = ['route', 'route_bottom', 'route_top'];

export const getDividedFeaturesBySections = (features: Feature[]) =>
  features.reduce<{ routes: Array<Feature>; other: Array<Feature> }>(
    (acc, feature) => {
      const isRoute = allowedValues.includes(feature.tags?.climbing);
      if (isRoute) {
        return { ...acc, routes: [...acc.routes, feature] };
      }
      return { ...acc, other: [...acc.other, feature] };
    },
    { routes: [], other: [] },
  );
