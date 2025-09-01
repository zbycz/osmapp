import { ClimbingRoute } from './types';
import { Feature, FeatureTags } from '../../../services/types';
import { useFeatureContext } from '../../utils/FeatureContext';
import { useClimbingContext } from './contexts/ClimbingContext';
import { invertedBoltCodeMap } from './utils/boltCodes';
import { useSnackbar } from '../../utils/SnackbarContext';
import {
  getNextWikimediaCommonsIndex,
  getWikimediaCommonsKey,
} from './utils/photo';
import { Setter } from '../../../types';
import { DataItem } from '../EditDialog/useEditItems';
import { saveChanges } from '../../../services/osm/auth/osmApiAuth';
import { fetchFreshItem } from '../EditDialog/itemsHelpers';

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

const areUpdatedTagsSame = (updatedTags: {}, origTags: FeatureTags) => {
  const isSame = Object.keys(updatedTags).every(
    (key) => updatedTags[key] === origTags[key],
  );
  return isSame;
};

export const getClimbingCragChanges = async (
  crag: Feature,
  photoPaths: Array<string>,
): Promise<DataItem[]> => {
  const updatedTags = {};
  photoPaths.forEach((photoPath, index) => {
    updatedTags[`wikimedia_commons${index === 0 ? '' : `:${index + 1}`}`] =
      `File:${photoPath}`;
  });

  if (areUpdatedTagsSame(updatedTags, crag.tags)) {
    return [];
  }

  const freshItem = await fetchFreshItem(crag.osmMeta);

  return [
    {
      ...freshItem,
      tagsEntries: Object.entries({
        ...Object.fromEntries(freshItem.tagsEntries),
        ...updatedTags,
      }),
    },
  ];
};

export const getClimbingRouteChanges = async (
  routes: ClimbingRoute[],
): Promise<DataItem[]> => {
  const existingRoutes = routes.filter((route) => route.feature); // TODO new routes

  const changedRoutes = existingRoutes.filter((route) => {
    const updatedTags = getUpdatedPhotoTags(route);
    return !areUpdatedTagsSame(updatedTags, route.feature.tags);
  });

  const changes = [];
  for (const route of changedRoutes) {
    const updatedTags = getUpdatedPhotoTags(route);
    const freshItem = await fetchFreshItem(route.feature.osmMeta);

    // we don't have to compare versions, because only :path tags are changed
    changes.push({
      ...freshItem,
      tagsEntries: Object.entries({
        ...Object.fromEntries(freshItem.tagsEntries),
        ...updatedTags,
      }),
    } as DataItem);
  }

  return changes;
};

export const useSaveCragFactory = (setIsEditMode: Setter<boolean>) => {
  const { feature: crag } = useFeatureContext();
  const { routes, photoPaths } = useClimbingContext();
  const { showToast } = useSnackbar();

  return async () => {
    const changes = [
      ...(await getClimbingRouteChanges(routes)),
      ...(await getClimbingCragChanges(crag, photoPaths)),
    ];

    if (changes.length === 0) {
      showToast('No changes found.', 'warning');
      return;
    }

    // eslint-disable-next-line no-alert
    if (window.confirm('Are you sure you want to save?') === false) {
      return;
    }

    const comment = `${changes.length} routes`;
    const result = await saveChanges(crag, comment, changes);

    console.log('All routes saved', changes, result); // eslint-disable-line no-console
    showToast('Data saved successfully!', 'success');
    setIsEditMode(false);
  };
};
