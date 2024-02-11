import { ClimbingRoute } from './types';
import { FeatureTags } from '../../../services/types';
import { useFeatureContext } from '../../utils/FeatureContext';
import { useClimbingContext } from './contexts/ClimbingContext';
import { editCrag } from '../../../services/osmApiAuth';

const boltCodeMap = {
  bolt: 'B',
  anchor: 'A',
  piton: 'P',
  sling: 'S',
};

const getPathString = (path) =>
  path.length === 0
    ? undefined // TODO if there was empty key='', we will delete it, even though we shouldn't
    : path
        ?.map(({ x, y, type }) => `${x},${y}${type ? boltCodeMap[type] : ''}`)
        .join('|');

const getUpdatedTags = (route: ClimbingRoute) => {
  const updatedTags = {};
  Object.entries(route.paths).forEach(([photoName, points]) => {
    const photoTagKey = route.photoToKeyMap[photoName];
    if(!photoTagKey) {
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

const getFeaturesToEdit = (routes: Array<ClimbingRoute>) => {
  const featuresToEdit = [];
  for (const route of routes) {
    if (!route.feature) {
      continue; // probably a new route // eslint-disable-line no-continue
    }
    const updatedTags = getUpdatedTags(route);
    if (isSameTags(updatedTags, route.feature.tags)) {
      continue; // eslint-disable-line no-continue
    }
    featuresToEdit.push({
      feature: route.feature,
      newTags: {
        ...route.feature.tags,
        ...updatedTags,
      },
    });
  }
  return featuresToEdit;
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

    const featuresToEdit = getFeaturesToEdit(routes);
    const comment = `${featuresToEdit.length} routes`;

    const result = await editCrag(crag, comment, featuresToEdit);

    console.log('All routes saved', result); // eslint-disable-line no-console
    setIsEditMode(false);
  };
};
