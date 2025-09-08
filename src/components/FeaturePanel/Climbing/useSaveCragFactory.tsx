import { ClimbingRoute } from './types';
import { Feature, FeatureTags, OsmId } from '../../../services/types';
import { useFeatureContext } from '../../utils/FeatureContext';
import { useClimbingContext } from './contexts/ClimbingContext';
import { useSnackbar } from '../../utils/SnackbarContext';
import {
  getNextWikimediaCommonsIndex,
  getWikimediaCommonsKey,
} from './utils/photo';
import { Setter } from '../../../types';
import { saveChanges } from '../../../services/osm/auth/osmApiAuth';
import { fetchFreshItem } from '../EditDialog/context/itemsHelpers';
import { stringifyPath } from './utils/pathUtils';
import { DataItem } from '../EditDialog/context/types';

const getUpdatedPhotoTags = (route: ClimbingRoute) => {
  const updatedTags = {};
  const newIndex = getNextWikimediaCommonsIndex(route.feature.tags);

  let offset = 0;
  Object.entries(route.paths).forEach(([photoName, points]) => {
    const photoKey = route.photoToKeyMap[photoName];

    if (photoKey) {
      updatedTags[`${photoKey}:path`] = stringifyPath(points);
    } else {
      const newKey = getWikimediaCommonsKey(newIndex + offset); // TODO this offset looks broken
      updatedTags[newKey] = `File:${photoName}`;
      updatedTags[`${newKey}:path`] = stringifyPath(points);
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

type ClimbingUpdate = {
  apiId: OsmId;
  updatedTags: FeatureTags;
};

const constructChanges = async (
  updates: ClimbingUpdate[],
): Promise<DataItem[]> => {
  const dataItems = [];
  for (const { apiId, updatedTags } of updates) {
    const freshItem = await fetchFreshItem(apiId);

    // we don't have to compare versions, because only :path tags are changed
    dataItems.push({
      ...freshItem,
      tagsEntries: Object.entries({
        ...Object.fromEntries(freshItem.tagsEntries),
        ...updatedTags,
      }),
    } as DataItem);
  }

  return dataItems;
};

export const getClimbingCragUpdates = (
  crag: Feature,
  photoPaths: Array<string>,
): ClimbingUpdate[] => {
  const updatedTags = {};
  photoPaths.forEach((photoPath, index) => {
    updatedTags[`wikimedia_commons${index === 0 ? '' : `:${index + 1}`}`] =
      `File:${photoPath}`; // TODO this may change order of wikimedia_commons:# tags, we need photoPaths to store keys as well
  });
  const apiId = crag.osmMeta;
  return areUpdatedTagsSame(updatedTags, crag.tags)
    ? []
    : [{ apiId, updatedTags }];
};

export const getClimbingRouteUpdates = (
  routes: ClimbingRoute[],
): ClimbingUpdate[] => {
  const existingRoutes = routes.filter((route) => route.feature); // TODO new routes

  return existingRoutes.flatMap((route) => {
    const updatedTags = getUpdatedPhotoTags(route);
    const apiId = route.feature.osmMeta;
    return areUpdatedTagsSame(updatedTags, route.feature.tags)
      ? []
      : [{ apiId, updatedTags }];
  });
};

export const useSaveCragFactory = (setIsEditMode: Setter<boolean>) => {
  const { feature: crag } = useFeatureContext();
  const { routes, photoPaths } = useClimbingContext();
  const { showToast } = useSnackbar();

  return async () => {
    const updates = [
      ...getClimbingRouteUpdates(routes),
      ...getClimbingCragUpdates(crag, photoPaths),
    ];

    if (updates.length === 0) {
      showToast('No changes found.', 'warning');
      return;
    }

    // eslint-disable-next-line no-alert
    if (window.confirm('Are you sure you want to save?') === false) {
      return;
    }

    const changes = await constructChanges(updates);

    const comment = `${changes.length} routes`;
    const result = await saveChanges(crag, comment, changes);

    console.log('All routes saved', { updates, changes, result }); // eslint-disable-line no-console
    showToast('Data saved successfully!', 'success');
    setIsEditMode(false);
  };
};
