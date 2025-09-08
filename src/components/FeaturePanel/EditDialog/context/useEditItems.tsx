import { LonLat } from '../../../../services/types';
import { getApiId } from '../../../../services/helpers';
import { Setter } from '../../../../types';
import { useCallback, useMemo, useState } from 'react';
import { publishDbgObject } from '../../../../utils';
import { getPresetTranslation } from '../../../../services/tagging/translations';
import { isEqual } from 'lodash';
import {
  DataItem,
  EditDataItem,
  Members,
  SetMembers,
  SetShortId,
  SetTagsEntries,
  TagsEntries,
} from './types';
import { convertToRelationFactory } from './convertToRelationFactory';
import { getName, getPresetKey } from './utils';

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

const setTagsEntriesFactory =
  (setDataItem: SetDataItem, tagsEntries: TagsEntries): SetTagsEntries =>
  (updateFn) =>
    setDataItem((prev) => ({
      ...prev,
      tagsEntries: updateFn(tagsEntries),
    }));

const setShortIdFactory =
  (setDataItem: SetDataItem): SetShortId =>
  (shortId) =>
    setDataItem((prev) => ({
      ...prev,
      shortId: shortId,
    }));

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

const getModifiedFlag = (dataItem: DataItem): boolean => {
  if (dataItem.shortId.includes('-')) {
    return true;
  }

  const { tagsEntries, toBeDeleted, nodeLonLat, nodes, members } = dataItem;
  const orig = dataItem.originalState;
  return (
    !isEqual(
      tagsEntries.filter(([k, v]) => k && v),
      Object.entries(orig.tags),
    ) ||
    !isEqual(nodeLonLat, orig.nodeLonLat) ||
    !isEqual(nodes, orig.nodes) ||
    !isEqual(members, orig.members) ||
    toBeDeleted !== orig.isDeleted
  );
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
          modified: getModifiedFlag(dataItem),
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
