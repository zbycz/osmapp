import { ConvertToRelation, DataItem } from './types';
import { fetchParentFeatures } from '../../../../services/osm/fetchParentFeatures';
import { getApiId } from '../../../../services/helpers';
import { addEmptyOriginalState, fetchFreshItem } from './itemsHelpers';
import { Setter } from '../../../../types';
import { fetchWays } from '../../../../services/osm/fetchWays';
import { getNewId } from '../../../../services/getCoordsFeature';
import { not } from '../../../../utils';
import { findInItems, isInItems } from './utils';

const updateMemberLinks = (
  item: DataItem,
  oldShortId: string,
  newRelation: DataItem,
) => {
  if (item.shortId === newRelation.shortId) {
    return item;
  }

  // update member id in every parent
  return {
    ...item,
    members: item.members?.map((member) =>
      member.shortId === oldShortId
        ? {
            shortId: newRelation.shortId,
            role: member.role,
          }
        : member,
    ),
  };
};
// TODO we may lose some custom tags, if converting new item (it is deleted afterwards)
//  remove climbing=* and find if this still matches some other preset (only keep it in that scenario)  (?)

const copiedClimbingTags = ([k, v]) =>
  k.startsWith('name') ||
  k.startsWith('climbing') ||
  k.startsWith('description') ||
  k.startsWith('wikimedia_commons') ||
  k.startsWith('website') ||
  (k === 'sport' && v === 'climbing');

const toBeRemovedTags = ([k, v]) =>
  k.startsWith('climbing') || (k === 'sport' && v === 'climbing');

const isNew = (item: DataItem) => item.shortId.includes('-');

const getConversionTags = (node: DataItem) => {
  const tagsToCopy = node.tagsEntries.filter(copiedClimbingTags);
  const restTags = node.tagsEntries.filter(not(copiedClimbingTags));

  const keepNode = !isNew(node) && restTags.length > 0;
  const keptTags = keepNode
    ? node.tagsEntries.filter(not(toBeRemovedTags))
    : [];

  return { tagsToCopy, keepNode, keptTags };
};

const fetchParentItems = async (shortId: string) => {
  const parentFeatures = await fetchParentFeatures(getApiId(shortId)); // without memberFeatures
  return await Promise.all(
    parentFeatures.map((feature) => fetchFreshItem(feature.osmMeta)), // we need full item (with members)
  );
};

export const convertToRelationFactory = (
  setData: Setter<DataItem[]>,
  shortId: string,
): ConvertToRelation => {
  // should work only for node - new or existing

  return async () => {
    const [parentItems, waysFeatures] = await Promise.all([
      fetchParentItems(shortId),
      fetchWays(getApiId(shortId)),
    ]);

    if (waysFeatures.length > 0) {
      throw new Error(`Can't convert node ${shortId} which is part of a way.`); // TODO duplicate the node ?
    }

    const newShortId = `r${getNewId()}`;
    setData((prevData) => {
      const node = findInItems(prevData, shortId);
      const { tagsToCopy, keepNode, keptTags } = getConversionTags(node);

      const newRelation: DataItem = addEmptyOriginalState({
        shortId: newShortId,
        version: undefined,
        tagsEntries: Object.entries(
          Object.fromEntries([
            ['type', 'site'],
            ['site', 'climbing'],
            ...tagsToCopy,
          ]),
        ),
        toBeDeleted: false,
        relationClickedLonLat: node.nodeLonLat,
        members: keepNode ? [{ shortId, role: '' }] : [],
      });

      const newData = prevData.map((item) =>
        item.shortId === shortId
          ? keepNode
            ? { ...item, tagsEntries: keptTags }
            : { ...item, toBeDeleted: true, tagsEntries: [] }
          : item,
      );
      newData.push(newRelation);

      // add all parent relations which are not already there
      newData.push(
        ...parentItems.filter((parent) => !isInItems(newData, parent.shortId)),
      );

      return newData.map((item) =>
        updateMemberLinks(item, shortId, newRelation),
      );
    });

    return newShortId;
  };
};
