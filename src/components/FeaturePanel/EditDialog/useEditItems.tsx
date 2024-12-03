import { Feature, FeatureTags } from '../../../services/types';
import { getShortId } from '../../../services/helpers';
import { getLabel } from '../../../helpers/featureLabel';
import { Setter } from '../../../types';
import { useMemo, useState } from 'react';

export type TagsEntries = [string, string][];

// internal type stored in the state
type DataItem = {
  shortId: string;
  tagsEntries: TagsEntries;
  toBeDeleted: boolean;
  members: {
    shortId: string;
    role: string;
    label: string; // cached from other dataItems, or from originalFeature
  }[];
};

export type EditDataItem = DataItem & {
  setTagsEntries: SetTagsEntries;
  tags: FeatureTags;
  setTag: (k: string, v: string) => void;
  toggleToBeDeleted: () => void;
  // TODO add  setMembers,
};

const buildDataItem = (feature: Feature): DataItem => {
  return {
    shortId: getShortId(feature.osmMeta),
    tagsEntries: Object.entries(feature.tags),
    toBeDeleted: false,
    members:
      feature.memberFeatures?.map((memberFeature) => ({
        shortId: getShortId(memberFeature.osmMeta),
        role: memberFeature.osmMeta.role,
        label: getLabel(memberFeature), // TODO what if user updates the tags ?
      })) ??
      feature.members?.map((member) => ({
        shortId: getShortId({ type: member.type, id: member.ref }),
        role: member.role,
        label: `${member.type} ${member.ref}`,
      })),
  };
};

type SetDataItem = (updateFn: (prevValue: DataItem) => DataItem) => void;
const setDataItemFactory =
  (setData: Setter<DataItem[]>, shortId: string): SetDataItem =>
  (updateFn) => {
    setData((prev) =>
      prev.map((item) => (item.shortId === shortId ? updateFn(item) : item)),
    );
  };

type SetTagsEntries = (updateFn: (prev: TagsEntries) => TagsEntries) => void;
const setTagsEntriesFactory =
  (setDataItem: SetDataItem, tagsEntries: TagsEntries): SetTagsEntries =>
  (updateFn) =>
    setDataItem((prev) => ({
      ...prev,
      tagsEntries: updateFn(tagsEntries),
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

export const useEditItems = (originalFeature: Feature) => {
  const [data, setData] = useState<DataItem[]>(() => [
    buildDataItem(originalFeature),
  ]);

  const items = useMemo<Array<EditDataItem>>(
    () =>
      data.map((dataItem) => {
        const { shortId, tagsEntries } = dataItem;
        const setDataItem = setDataItemFactory(setData, shortId);
        const setTagsEntries = setTagsEntriesFactory(setDataItem, tagsEntries);
        return {
          ...dataItem,
          setTagsEntries,
          tags: Object.fromEntries(tagsEntries),
          setTag: setTagFactory(setTagsEntries),
          toggleToBeDeleted: toggleToBeDeletedFactory(setDataItem),
        };
      }),
    [data],
  );

  const addFeature = (feature: Feature) => {
    const newItem = buildDataItem(JSON.parse(JSON.stringify(feature)));
    setData((state) => [...state, newItem]);
  };

  return { items, addFeature };
};
