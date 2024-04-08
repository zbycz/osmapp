import { ClimbingRoute } from './types';
import { FeatureTags } from '../../../services/types';
import { useFeatureContext } from '../../utils/FeatureContext';
import { useClimbingContext } from './contexts/ClimbingContext';
import { Change, editCrag } from '../../../services/osmApiAuth';
import { invertedBoltCodeMap } from './utils/boltCodes';

const getPathString = (path) =>
  path.length === 0
    ? undefined // TODO if there was empty key='', we will delete it, even though we shouldn't
    : path
        ?.map(
          ({ x, y, type }) =>
            `${x},${y}${type ? invertedBoltCodeMap[type] : ''}`,
        )
        .join('|');

const getUpdatedTags = (route: ClimbingRoute) => {
  const updatedTags = {};
  Object.entries(route.paths).forEach(([photoName, points]) => {
    const photoTagKey = route.photoToKeyMap[photoName];
    if (!photoTagKey) {
      updatedTags[photoTagKey] = `File:${photoName}`;
    }
    updatedTags[`${photoTagKey}:path`] = getPathString(points);
  });
  return updatedTags;
};

const isSameTags = (updatedTags: {}, origTags: FeatureTags) => {
  const isSame = Object.keys(updatedTags).every(
    (key) => origTags[key] === updatedTags[key],
  );
  return isSame;
};

const getChanges = (routes: ClimbingRoute[]): Change[] => {
  const existingRoutes = routes.filter((route) => route.feature); // TODO new routes

  return existingRoutes
    .map((route) => {
      const updatedTags = getUpdatedTags(route);
      const isSame = isSameTags(updatedTags, route.feature.tags);
      return isSame
        ? undefined
        : {
            feature: route.feature,
            allTags: {
              ...route.feature.tags,
              ...updatedTags,
            },
          };
    })
    .filter(Boolean);
};

export const useGetHandleSave = (
  setIsEditMode: (value: boolean | ((old: boolean) => boolean)) => void,
) => {
  const { feature: crag } = useFeatureContext();
  const { routes } = useClimbingContext();

  return async () => {
    // eslint-disable-next-line no-alert
    if (window.confirm('Are you sure you want to save?') === false) {
      return;
    }

    const changes = getChanges(routes);
    const comment = `${changes.length} routes`;
    const result = await editCrag(crag, comment, changes);

    console.log('All routes saved', result); // eslint-disable-line no-console
    setIsEditMode(false);
  };
};
