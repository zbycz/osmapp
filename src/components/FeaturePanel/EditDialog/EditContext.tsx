import React, { createContext, useContext, useMemo, useState } from 'react';
import { useToggleState } from '../../helpers';
import {
  Feature,
  FeatureTags,
  OsmId,
  SuccessInfo,
} from '../../../services/types';
import { Setter } from '../../../types';
import { getShortId } from '../../../services/helpers';
import { getLabel } from '../../../helpers/featureLabel';

export type TagsEntries = [string, string][];

export type FeatureEditData = {
  featureId: OsmId;
  tagsEntries: TagsEntries;
  setTagsEntries: Setter<TagsEntries>;
  tags: FeatureTags;
  setTag: (k: string, v: string) => void;
  toBeDeleted: boolean;
  toggleToBeDeleted: () => void;
  // TODO add members
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
  data: {
    items: Array<FeatureEditData>;
    addFeature: (feature: Feature) => void;
  };
};

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

const buildDataItem = (originalFeature: Feature): DataItem => ({
  shortId: getShortId(originalFeature.osmMeta),
  tagsEntries: Object.entries(originalFeature.tags),
  toBeDeleted: false,
  members: originalFeature.memberFeatures.map((memberFeature) => ({
    shortId: getShortId(memberFeature.osmMeta),
    role: memberFeature.osmMeta.role,
    label: getLabel(memberFeature),
  })),
});

type SetDataItem = (newData: Partial<DataItem>) => void;

const setDataItemFactory =
  (setData: Setter<DataItem[]>, shortId: string): SetDataItem =>
  (newData: Partial<DataItem>) => {
    setData((state) =>
      state.map((item) =>
        item.shortId === shortId ? { ...item, ...newData } : item,
      ),
    );
  };

const setTagsEntriesFactory =
  (setDataItem: SetDataItem) => (tagsEntries: TagsEntries) =>
    setDataItem({ tagsEntries });

const setTagFactory = (setTagsEntries) => (k: string, v: string) => {
  setTagsEntries((state) => {
    const position = state.findIndex(([key]) => key === k);
    if (position === -1) {
      return [...state, [k, v]];
    }
    return state.map((entry, index) => (index === position ? [k, v] : entry));
  });
};

const toggleToBeDeletedFactory = (
  setDataItem: SetDataItem,
  toBeDeleted: boolean,
) => {
  return () => setDataItem({ toBeDeleted: !toBeDeleted });
};

const useDataState = (originalFeature: Feature): EditContextType['data'] => {
  const [data, setData] = useState<DataItem[]>(() => [
    buildDataItem(originalFeature),
  ]);

  const items = useMemo(
    () =>
      data.map((dataItem) => {
        const { shortId, tagsEntries, toBeDeleted, members } = dataItem;
        const setDataItem = setDataItemFactory(setData, shortId);
        const setTagsEntries = setTagsEntriesFactory(setDataItem);
        return {
          shortId,
          tagsEntries,
          setTagsEntries,
          tags: Object.fromEntries(tagsEntries),
          setTag: setTagFactory(setTagsEntries),
          toBeDeleted,
          toggleToBeDeleted: toggleToBeDeletedFactory(setDataItem, toBeDeleted),
          members,
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
  const data = useDataState(originalFeature);

  const value: EditContextType = {
    successInfo,
    setSuccessInfo,
    isSaving,
    setIsSaving,
    location,
    setLocation,
    comment,
    setComment,
    data,
  };

  return <EditContext.Provider value={value}>{children}</EditContext.Provider>;
};

export const useEditContext = () => useContext(EditContext);
