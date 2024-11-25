import { ClimbingRoute } from './types';
import { FeatureTags } from '../../../services/types';
import { useFeatureContext } from '../../utils/FeatureContext';
import { useClimbingContext } from './contexts/ClimbingContext';
import { Change, editCrag } from '../../../services/osmApiAuth';
import { invertedBoltCodeMap } from './utils/boltCodes';
import { useSnackbar } from '../../utils/SnackbarContext';
import {
  getNextWikimediaCommonsIndex,
  getWikimediaCommonsKey,
} from './utils/photo';
import { result } from 'lodash';

const getPathString = (path) =>
  path.length === 0
    ? undefined // TODO if there was empty key='', we will delete it, even though we shouldn't
    : path
        ?.map(
          ({ x, y, type }) =>
            `${x},${y}${type ? invertedBoltCodeMap[type] : ''}`,
        )
        .join('|');

const getUpdatedPhotoTags = (route: ClimbingRoute) => {
  const updatedTags = {};
  const newIndex = getNextWikimediaCommonsIndex(route.feature.tags);

  let offset = 0;
  Object.entries(route.paths).forEach(([photoName, points]) => {
    const photoKey = route.photoToKeyMap[photoName];

    if (photoKey) {
      updatedTags[`${photoKey}:path`] = getPathString(points);
    } else {
      const newKey = getWikimediaCommonsKey(newIndex + offset); // TODO this offset looks broken
      updatedTags[newKey] = `File:${photoName}`;
      updatedTags[`${newKey}:path`] = getPathString(points);
      offset += 1;
    }
  });
  return updatedTags;
};

const isSameTags = (updatedTags: {}, origTags: FeatureTags) => {
  const isSame = Object.keys(updatedTags).every(
    (key) => origTags[key] === updatedTags[key],
  );
  return isSame;
};

export const getClimbingRouteChanges = (routes: ClimbingRoute[]): Change[] => {
  const existingRoutes = routes.filter((route) => route.feature); // TODO new routes

  return existingRoutes
    .map((route) => {
      const updatedTags = {
        ...getUpdatedPhotoTags(route),
      };
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
  const { routes, photoPaths } = useClimbingContext();
  const { showToast } = useSnackbar();

  return async () => {
    // eslint-disable-next-line no-alert
    if (window.confirm('Are you sure you want to save?') === false) {
      return;
    }

    const updatedCrag = {
      ...crag,
      tags: {
        ...crag.tags,
        ...photoPaths.reduce((acc, photoPath, index) => {
          return {
            ...acc,
            [`wikimedia_commons${index === 0 ? '' : `:${index + 1}`}`]: `File:${photoPath}`,
          };
        }, {}),
      },
    };

    const changes = getClimbingRouteChanges(routes);
    const comment = `${changes.length} routes`;
    const result = await editCrag(updatedCrag, comment, changes);

    console.log('All routes saved', changes, result); // eslint-disable-line no-console
    showToast('Data saved successfully!', 'success');
    setIsEditMode(false);
  };
};
