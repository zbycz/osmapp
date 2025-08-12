import { FeatureTags, LonLat } from '../../../services/types';
import { getApiId } from '../../../services/helpers';
import { Setter } from '../../../types';
import { useCallback, useMemo, useState } from 'react';
import { publishDbgObject } from '../../../utils';
import { findPreset } from '../../../services/tagging/presets';
import { getPresetTranslation } from '../../../services/tagging/translations';
import { getNewId } from '../../../services/getCoordsFeature';
import { fetchParentFeatures } from '../../../services/osm/fetchParentFeatures';
import { fetchWays } from '../../../services/osm/fetchWays';
import { fetchFreshItem } from './itemsHelpers';

export type TagsEntries = [string, string][];

export type Members = Array<{
  shortId: string;
  role: string;
  label: string; // cached from other dataItems, or from originalFeature
  // TODO rename to originalLabel - only to be used when member is not among editItems
}>;

// internal type stored in the state
export type DataItem = {
  shortId: string;
  version: number | undefined; // undefined for new item
  tagsEntries: TagsEntries;
  toBeDeleted: boolean;
  nodeLonLat: LonLat | undefined; // only for nodes
  nodes: number[] | undefined; // only for ways
  members: Members | undefined; // only for relations
};

export type EditDataItem = DataItem & {
  setTagsEntries: SetTagsEntries;
  tags: FeatureTags;
  setTag: (k: string, v: string) => void;
  presetKey: string;
  presetLabel: string;
  setMembers: SetMembers;
  setShortId: SetShortId;
  setNodeLonLat: (lonLat: LonLat) => void;
  toggleToBeDeleted: () => void;
  convertToRelation: ConvertToRelation;
};

export const getPresetKey = ({ shortId, tagsEntries }: DataItem) => {
  const tags = Object.fromEntries(tagsEntries);
  const osmId = getApiId(shortId);
  const preset = findPreset(osmId.type, tags);
  return preset.presetKey;
};

const getName = (d: DataItem): string | undefined =>
  d.tagsEntries.find(([k]) => k === 'name')?.[1];

const someNameHasChanged = (prevData: DataItem[], newData: DataItem[]) => {
  const prevNames = prevData.map((d) => getName(d));
  const newNames = newData.map((d) => getName(d));
  return prevNames.some((name, index) => name !== newNames[index]);
};

const hasMember = (item: DataItem, shortId: string) =>
  item.members?.some((member) => member.shortId === shortId);

const getItemName = (items: DataItem[], shortId: string) => {
  const current = items.find((dataItem) => dataItem.shortId === shortId);
  return getName(current);
};

const cloneItem = (item: DataItem) =>
  JSON.parse(JSON.stringify(item)) as DataItem;

const updateAllMemberLabels = (newItems: DataItem[], updatedId: string) =>
  newItems.map((item) => {
    if (hasMember(item, updatedId)) {
      const clone = cloneItem(item);
      const { members } = clone;
      const idx = members.findIndex(({ shortId }) => shortId === updatedId);
      members[idx].label = getItemName(newItems, updatedId);
      return clone;
    } else {
      return item;
    }
  });

type SetDataItem = (updateFn: (prevValue: DataItem) => DataItem) => void;
const setDataItemFactory =
  (setData: Setter<DataItem[]>, shortId: string): SetDataItem =>
  (updateFn) => {
    setData((prevData) => {
      const newData = prevData.map((item) =>
        item.shortId === shortId ? updateFn(item) : item,
      );

      if (someNameHasChanged(prevData, newData)) {
        // only current item can change, but this check is cheap
        return updateAllMemberLabels(newData, shortId);
      }
      return newData;
    });
  };

type ConvertToRelation = () => Promise<string>;
const convertToRelationFactory = (
  setData: Setter<DataItem[]>,
  shortId: string,
): ConvertToRelation => {
  return async () => {
    const [parentFeatures, waysFeatures] = await Promise.all([
      fetchParentFeatures(getApiId(shortId)),
      fetchWays(getApiId(shortId)),
    ]);

    if (waysFeatures.length > 0) {
      throw new Error(`Can't convert node ${shortId} which is part of a way.`); // TODO duplicate the node ?
    }

    const parentItems = await Promise.all(
      parentFeatures.map((feature) => fetchFreshItem(feature.osmMeta)),
    );

    const newShortId = `r${getNewId()}`;
    setData((prevData) => {
      // TODO - don't delete e.g. natural=peak - leave it as node
      const newData = prevData.map((item) =>
        item.shortId === shortId ? { ...item, toBeDeleted: true } : item,
      );
      const currentItem = newData.find((item) => item.shortId === shortId);

      const newRelation: DataItem = {
        shortId: newShortId,
        version: undefined,
        tagsEntries: [['type', 'site'], ...currentItem.tagsEntries],
        toBeDeleted: false,
        nodeLonLat: undefined,
        nodes: undefined,
        members: [],
      };
      newData.push(newRelation);

      // add all parent relations which are not already there
      const newParentItems = parentItems.filter(
        (parent) => !newData.some((item) => item.shortId === parent.shortId),
      );
      newData.push(...newParentItems);

      // update member id everywhere
      return newData.map((item) => ({
        ...item,
        members: item.members?.map((member) =>
          member.shortId === shortId
            ? {
                ...member,
                shortId: newShortId,
                label: getName(newRelation) ?? newShortId,
              }
            : member,
        ),
      }));
    });

    return newShortId;
  };
};

type SetTagsEntries = (updateFn: (prev: TagsEntries) => TagsEntries) => void;
const setTagsEntriesFactory =
  (setDataItem: SetDataItem, tagsEntries: TagsEntries): SetTagsEntries =>
  (updateFn) =>
    setDataItem((prev) => ({
      ...prev,
      tagsEntries: updateFn(tagsEntries),
    }));

type SetShortId = (shortId: string) => void;
const setShortIdFactory =
  (setDataItem: SetDataItem): SetShortId =>
  (shortId) =>
    setDataItem((prev) => ({
      ...prev,
      shortId: shortId,
    }));

type SetMembers = (updateFn: (prev: Members) => Members) => void;
const setMembersFactory =
  (setDataItem: SetDataItem, members: Members): SetMembers =>
  (updateFn) =>
    setDataItem((prev) => ({
      ...prev,
      members: updateFn(members),
    }));

type SetNodeLonLat = (lonLat: LonLat) => void;
const setNodeLonLatFactory =
  (setDataItem: SetDataItem): SetNodeLonLat =>
  (lonLat) =>
    setDataItem((prev) => ({
      ...prev,
      nodeLonLat: lonLat,
    }));

type SetTag = (k: string, v: string) => void;
const setTagFactory =
  (setTagsEntries: SetTagsEntries): SetTag =>
  (k, v) => {
    setTagsEntries((prev) => {
      const position = prev.findIndex(([key]) => key === k);
      return position === -1
        ? [...prev, [k, v]]
        : prev.map((entry, index) => (index === position ? [k, v] : entry));
    });
  };

const toggleToBeDeletedFactory = (setDataItem: SetDataItem) => {
  return () =>
    setDataItem((prev) => ({
      ...prev,
      toBeDeleted: !prev.toBeDeleted,
    }));
};

export const useEditItems = () => {
  const [data, setData] = useState<DataItem[]>([]);

  const items = useMemo<Array<EditDataItem>>(
    () =>
      data.map((dataItem) => {
        const { shortId, tagsEntries, members } = dataItem;
        const setDataItem = setDataItemFactory(setData, shortId);
        const setTagsEntries = setTagsEntriesFactory(setDataItem, tagsEntries);
        const setMembers = setMembersFactory(setDataItem, members);
        const presetKey = getPresetKey(dataItem);
        return {
          ...dataItem,
          setTagsEntries,
          setShortId: setShortIdFactory(setDataItem),
          tags: Object.fromEntries(tagsEntries),
          setTag: setTagFactory(setTagsEntries),
          toggleToBeDeleted: toggleToBeDeletedFactory(setDataItem),
          setMembers,
          setNodeLonLat: setNodeLonLatFactory(setDataItem),
          presetKey,
          presetLabel: getPresetTranslation(presetKey),
          convertToRelation: convertToRelationFactory(setData, shortId),
        };
        // TODO maybe keep reference to original EditDataItem if DataItem didnt change? #performance
      }),
    [data],
  );

  const addItem = useCallback((newItem: DataItem) => {
    setData((state) => [...state, newItem]);
  }, []);

  const removeItem = useCallback((shortId: string) => {
    if (getApiId(shortId).id > 0) {
      throw new Error('Existing item should not be removed from items.');
    }
    setData((state) => state.filter((item) => item.shortId !== shortId));
  }, []);

  publishDbgObject('EditContext state', data);

  return { items, addItem, removeItem };
};
