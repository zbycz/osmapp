import { Feature, FeatureTags, LonLat } from '../../../services/types';
import { getShortId } from '../../../services/helpers';
import { getLabel } from '../../../helpers/featureLabel';
import { Setter } from '../../../types';
import { useMemo, useState } from 'react';
import { publishDbgObject } from '../../../utils';

export type TagsEntries = [string, string][];

export type Members = Array<{
  shortId: string;
  role: string;
  label: string; // cached from other dataItems, or from originalFeature
}>;

// internal type stored in the state
type DataItem = {
  shortId: string;
  tagsEntries: TagsEntries;
  toBeDeleted: boolean;
  members: Members;
  version: number | undefined; // undefined for new item
  newNodeLonLat?: LonLat;
};

export type EditDataItem = DataItem & {
  setTagsEntries: SetTagsEntries;
  tags: FeatureTags;
  setTag: (k: string, v: string) => void;
  toggleToBeDeleted: () => void;
  setMembers: SetMembers;
};

const buildDataItem = (feature: Feature): DataItem => {
  const apiId = feature.osmMeta;
  return {
    shortId: getShortId(apiId),
    version: apiId.version,
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
    newNodeLonLat: apiId.id < 0 ? feature.center : null,
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

type SetMembers = (updateFn: (prev: Members) => Members) => void;
const setMembersFactory =
  (setDataItem: SetDataItem, members: Members): SetMembers =>
  (updateFn) =>
    setDataItem((prev) => ({
      ...prev,
      members: updateFn(members),
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
        const { shortId, tagsEntries, members } = dataItem;
        const setDataItem = setDataItemFactory(setData, shortId);
        const setTagsEntries = setTagsEntriesFactory(setDataItem, tagsEntries);
        const setMembers = setMembersFactory(setDataItem, members);
        return {
          ...dataItem,
          setTagsEntries,
          tags: Object.fromEntries(tagsEntries),
          setTag: setTagFactory(setTagsEntries),
          toggleToBeDeleted: toggleToBeDeletedFactory(setDataItem),
          setMembers,
        };
      }),
    [data],
  );

  const addFeature = (feature: Feature) => {
    const newItem = buildDataItem(JSON.parse(JSON.stringify(feature)));
    setData((state) => [...state, newItem]);
  };

  publishDbgObject('EditContext state', data);

  return { items, addFeature };
};
