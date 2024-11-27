import React, { createContext, useContext, useMemo, useState } from 'react';
import { useToggleState } from '../../helpers';
import {
  Feature,
  FeatureTags,
  OsmId,
  SuccessInfo,
} from '../../../services/types';
import { Setter } from '../../../types';

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
  data: Array<FeatureEditData>;
};

const useDataState = (originalFeature: Feature): EditContextType['data'] => {
  const [tagsEntries, setTagsEntries] = useState<TagsEntries>(() =>
    Object.entries(originalFeature.tags),
  );
  const tags = useMemo(() => Object.fromEntries(tagsEntries), [tagsEntries]);

  const setTag = (k: string, v: string) => {
    setTagsEntries((state) => {
      const position = state.findIndex(([key]) => key === k);
      if (position === -1) {
        return [...state, [k, v]];
      }
      return state.map((entry, index) => (index === position ? [k, v] : entry));
    });
  };

  const [toBeDeleted, toggleToBeDeleted] = useToggleState(false);

  return [
    {
      featureId: originalFeature.osmMeta,
      tagsEntries,
      setTagsEntries,
      tags,
      setTag,
      toBeDeleted,
      toggleToBeDeleted,
    },
  ];
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
