import { ClimbingRoute } from './types';
import { Feature, FeatureTags } from '../../../services/types';
import { useFeatureContext } from '../../utils/FeatureContext';
import { useClimbingContext } from './contexts/ClimbingContext';
import { CragChange, editCrag } from '../../../services/osm/auth/editCrag';
import { invertedBoltCodeMap } from './utils/boltCodes';
import { useSnackbar } from '../../utils/SnackbarContext';
import {
  getNextWikimediaCommonsIndex,
  getWikimediaCommonsKey,
} from './utils/photo';
import { Setter } from '../../../types';

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

export const getClimbingCragChanges = (
  crag: Feature,
  photoPaths: Array<string>,
): CragChange[] => {
  const newTags = {
    ...crag.tags,
    ...photoPaths.reduce((acc, photoPath, index) => {
      return {
        ...acc,
        [`wikimedia_commons${index === 0 ? '' : `:${index + 1}`}`]: `File:${photoPath}`,
      };
    }, {}),
  };
  const updatedCrag = {
    ...crag,
    tags: newTags,
  };

  const isSame = isSameTags(newTags, crag.tags);

  return isSame ? [] : [{ feature: updatedCrag, allTags: newTags }];
};

export const getClimbingRouteChanges = (
  routes: ClimbingRoute[],
): CragChange[] => {
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

export const useGetHandleSave = (setIsEditMode: Setter<boolean>) => {
  const { feature: crag } = useFeatureContext();
  const { routes, photoPaths } = useClimbingContext();
  const { showToast } = useSnackbar();

  return async () => {
    // eslint-disable-next-line no-alert
    if (window.confirm('Are you sure you want to save?') === false) {
      return;
    }

    const changes = [
      ...getClimbingRouteChanges(routes),
      ...getClimbingCragChanges(crag, photoPaths),
    ];
    const comment = `${changes.length} routes`;
    const result = await editCrag(crag, comment, changes);

    console.log('All routes saved', changes, result); // eslint-disable-line no-console
    showToast('Data saved successfully!', 'success');
    setIsEditMode(false);
  };
};
