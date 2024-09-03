import React, { createContext, useContext, useState } from 'react';
import { useToggleState } from '../../helpers';
import { Feature, FeatureTags, SuccessInfo } from '../../../services/types';

export type TypeTag = { key: string; value: string } | undefined;
type EditContextType = {
  successInfo: undefined | SuccessInfo;
  setSuccessInfo: (info: undefined | SuccessInfo) => void;
  isSaving: boolean;
  setIsSaving: (b: boolean) => void;
  location: string;
  setLocation: (s: string) => void;
  comment: string;
  setComment: (s: string) => void;
  tags: {
    typeTag: TypeTag;
    setTypeTag: (typeTag: TypeTag) => void;
    tags: FeatureTags;
    setTag: (k: string, v: string) => void;
    tmpNewTag: {};
    setTmpNewTag: (obj: {}) => void;
    cancelled: boolean;
    toggleCancelled: () => void;
  };
};

const useTagsState = (
  initialTags: FeatureTags,
): [FeatureTags, (k: string, v: string) => void] => {
  const [tags, setTags] = useState(initialTags);
  const setTag = (k, v) => setTags((state) => ({ ...state, [k]: v }));
  return [tags, setTag];
};

const EditContext = createContext<EditContextType>(undefined);

type Props = {
  feature: Feature;
  children: React.ReactNode;
};

export const EditContextProvider = ({ feature, children }: Props) => {
  const [successInfo, setSuccessInfo] = useState<undefined | SuccessInfo>();
  const [isSaving, setIsSaving] = useState(false);
  const [location, setLocation] = useState('');
  const [comment, setComment] = useState('');

  const [typeTag, setTypeTag] = useState<TypeTag>();
  const [tags, setTag] = useTagsState(feature.tags);
  const [tmpNewTag, setTmpNewTag] = useState({});
  const [cancelled, toggleCancelled] = useToggleState(false);

  const value: EditContextType = {
    successInfo,
    setSuccessInfo,
    isSaving,
    setIsSaving,
    location,
    setLocation,
    comment,
    setComment,
    tags: {
      typeTag,
      setTypeTag,
      tags,
      setTag,
      tmpNewTag,
      setTmpNewTag,
      cancelled,
      toggleCancelled,
    },
  };

  return <EditContext.Provider value={value}>{children}</EditContext.Provider>;
};

export const useEditContext = () => useContext(EditContext);
