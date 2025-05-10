import React, { createContext, useContext, useState } from 'react';
import { Feature, SuccessInfo } from '../../../services/types';
import { DataItem, EditDataItem, useEditItems } from './useEditItems';
import { getShortId } from '../../../services/helpers';
import { useEditDialogFeature } from './utils';

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
  addNewItem: (newItem: DataItem) => void;
  items: Array<EditDataItem>;
  current: string;
  setCurrent: (s: string) => void;
};

const EditContext = createContext<EditContextType>(undefined);

type Props = {
  originalFeature: Feature;
  children: React.ReactNode;
};

export const EditContextProvider = ({ originalFeature, children }: Props) => {
  const { feature } = useEditDialogFeature();
  const [successInfo, setSuccessInfo] = useState<undefined | SuccessInfo>();
  const [isSaving, setIsSaving] = useState(false);
  const [location, setLocation] = useState(''); // technically is "data", but only for note
  const [comment, setComment] = useState('');
  const { items, addFeature, addNewItem } = useEditItems(originalFeature);
  const [current, setCurrent] = React.useState(getShortId(feature.osmMeta));

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
    addNewItem,
    items,
    current,
    setCurrent,
  };

  return <EditContext.Provider value={value}>{children}</EditContext.Provider>;
};

export const useEditContext = () => useContext(EditContext);
