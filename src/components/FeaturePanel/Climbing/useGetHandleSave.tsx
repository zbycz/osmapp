import { ClimbingRoute } from './types';
import { FeatureTags } from '../../../services/types';
import { useFeatureContext } from '../../utils/FeatureContext';
import { useClimbingContext } from './contexts/ClimbingContext';
import { Change, editCrag } from '../../../services/osmApiAuth';
import { invertedBoltCodeMap } from './utils/boltCodes';
import { getOsmTagFromGradeSystem } from './utils/grades/routeGrade';
import { useSnackbar } from '../../utils/SnackbarContext';
import {
  getNewWikimediaCommonsIndex,
  getWikimediaCommonsKey,
} from './utils/photo';

const getPathString = (path) =>
  path.length === 0
    ? undefined // TODO if there was empty key='', we will delete it, even though we shouldn't
    : path
        ?.map(
          ({ x, y, type }) =>
            `${x},${y}${type ? invertedBoltCodeMap[type] : ''}`,
        )
        .join('|');

const getUpdatedBasicTags = (route: ClimbingRoute) => {
  const checkedTags = ['name', 'description', 'author'];
  const updatedTags = {};
  checkedTags.forEach((tagToCheck) => {
    if (route[tagToCheck] !== route.feature.tags[tagToCheck]) {
      updatedTags[tagToCheck] = route[tagToCheck];
    }
  });

  const newGradeSystem = route.difficulty?.gradeSystem;
  const gradeSystemKey = getOsmTagFromGradeSystem(newGradeSystem);
  const featureDifficulty = route.feature.tags[gradeSystemKey];

  const isGradeUpdated = route.difficulty?.grade !== featureDifficulty;

  if (newGradeSystem && isGradeUpdated) {
    updatedTags[gradeSystemKey] = route.difficulty.grade;
    // @TODO: delete previous grade? if(!featureDifficulty)
  }

  return updatedTags;
};

const getUpdatedPhotoTags = (route: ClimbingRoute) => {
  const updatedTags = {};
  const newIndex = getNewWikimediaCommonsIndex(route.feature);

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

export const getChanges = (routes: ClimbingRoute[]): Change[] => {
  const existingRoutes = routes.filter((route) => route.feature); // TODO new routes

  return existingRoutes
    .map((route) => {
      const updatedTags = {
        ...getUpdatedBasicTags(route),
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
  const { routes } = useClimbingContext();
  const showSnackbar = useSnackbar();

  return async () => {
    // eslint-disable-next-line no-alert
    if (window.confirm('Are you sure you want to save?') === false) {
      return;
    }

    const changes = getChanges(routes);
    const comment = `${changes.length} routes`;
    const result = await editCrag(crag, comment, changes);

    console.log('All routes saved', result); // eslint-disable-line no-console
    showSnackbar('Data saved successfully!', 'success');
    setIsEditMode(false);
  };
};
