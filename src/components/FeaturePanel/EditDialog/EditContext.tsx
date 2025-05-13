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
  addItem: (newItem: DataItem) => void;
  removeItem: (shortId: string) => void;
  items: Array<EditDataItem>;
  current: string;
  setCurrent: (s: string) => void;
};

const EditContext = createContext<EditContextType>(undefined);

type Props = {
  initialItem: DataItem;
  children: React.ReactNode;
};

export const EditContextProvider = ({ initialItem, children }: Props) => {
  const [successInfo, setSuccessInfo] = useState<undefined | SuccessInfo>();
  const [isSaving, setIsSaving] = useState(false);
  const [location, setLocation] = useState(''); // only for note
  const [comment, setComment] = useState('');
  const { items, addItem, removeItem } = useEditItems(initialItem);
  const [current, setCurrent] = useState(initialItem.shortId);

  const value: EditContextType = {
    successInfo,
    setSuccessInfo,
    isSaving,
    setIsSaving,
    location,
    setLocation,
    comment,
    setComment,
    addItem,
    removeItem,
    items,
    current,
    setCurrent,
  };

  return <EditContext.Provider value={value}>{children}</EditContext.Provider>;
};

export const useEditContext = () => useContext(EditContext);
