import React, { createContext, useContext, useMemo, useState } from 'react';
import { Feature, FeatureTags, SuccessInfo } from '../../../services/types';
import { Setter } from '../../../types';
import { getShortId } from '../../../services/helpers';
import { getLabel } from '../../../helpers/featureLabel';

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

const buildDataItem = (feature: Feature): DataItem => {
  if (feature.osmMeta.type === 'relation' && !feature.memberFeatures) {
    throw new Error('To edit `relation` you must add `memberFeatures`.');
  }

  return {
    shortId: getShortId(feature.osmMeta),
    tagsEntries: Object.entries(feature.tags),
    toBeDeleted: false,
    members: feature.memberFeatures?.map((memberFeature) => ({
      shortId: getShortId(memberFeature.osmMeta),
      role: memberFeature.osmMeta.role,
      label: getLabel(memberFeature),
    })),
  };
};

type SetDataItem = (updateFn: (prevValue: DataItem) => DataItem) => void;
const setDataItemFactory =
  (setData: Setter<DataItem[]>, shortId: string): SetDataItem =>
  (updateFn) => {
    setData((state) =>
      state.map((item) => (item.shortId === shortId ? updateFn(item) : item)),
    );
  };

type SetTagsEntries = (updateFn: (prev: TagsEntries) => TagsEntries) => void;
const setTagsEntriesFactory =
  (setDataItem: SetDataItem, tagsEntries: TagsEntries): SetTagsEntries =>
  (updateFn) =>
    setDataItem((prev) => ({ ...prev, tagsEntries: updateFn(tagsEntries) }));

type SetTag = (k: string, v: string) => void;
const setTagFactory =
  (setTagsEntries: SetTagsEntries): SetTag =>
  (k: string, v: string) => {
    setTagsEntries((prev: TagsEntries) => {
      const position = prev.findIndex(([key]) => key === k);
      if (position === -1) {
        return [...prev, [k, v]];
      }
      return prev.map((entry, index) => (index === position ? [k, v] : entry));
    });
  };

const toggleToBeDeletedFactory = (setDataItem: SetDataItem) => {
  return () =>
    setDataItem((prev) => ({ ...prev, toBeDeleted: !prev.toBeDeleted }));
};

export type EditDataItem = DataItem & {
  setTagsEntries: SetTagsEntries;
  tags: FeatureTags;
  setTag: (k: string, v: string) => void;
  toggleToBeDeleted: () => void;
  // TODO add  setMembers,
};

type EditContextType = {
  successInfo: undefined | SuccessInfo;
  setSuccessInfo: (info: undefined | SuccessInfo) => void;
  isSaving: boolean;
  setIsSaving: (b: boolean) => void;
  location: string;
  setLocation: (s: string) => void;
  comment: string;
  setComment: (s: string) => void;
  addFeature: (feature: Feature) => void;
  items: Array<EditDataItem>;
};

const useItems = (originalFeature: Feature) => {
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
    setData((state) => [...state, buildDataItem(feature)]);
  };

  return { items, addFeature };
};

const EditContext = createContext<EditContextType>(undefined);

type Props = {
  originalFeature: Feature;
  children: React.ReactNode;
};

export const EditContextProvider = ({ originalFeature, children }: Props) => {
  const [successInfo, setSuccessInfo] = useState<undefined | SuccessInfo>();
  const [isSaving, setIsSaving] = useState(false);
  const [location, setLocation] = useState(''); // technically is "data", but only for note
  const [comment, setComment] = useState('');
  const { items, addFeature } = useItems(originalFeature);

  const value: EditContextType = {
    successInfo,
    setSuccessInfo,
    isSaving,
    setIsSaving,
    location,
    setLocation,
    comment,
    setComment,
    addFeature,
    items,
  };

  return <EditContext.Provider value={value}>{children}</EditContext.Provider>;
};

export const useEditContext = () => useContext(EditContext);
