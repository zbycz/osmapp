import React, { createContext, useContext, useState } from 'react';
import { SuccessInfo } from '../../../services/types';
import { DataItem, EditDataItem, useEditItems } from './useEditItems';
import { Setter } from '../../../types';

type ShortId = string;

type EditContextType = {
  successInfo: undefined | SuccessInfo;
  setSuccessInfo: Setter<undefined | SuccessInfo>;
  isSaving: boolean;
  setIsSaving: Setter<boolean>;
  location: string;
  setLocation: Setter<string>;
  comment: string;
  setComment: Setter<string>;
  addItem: (newItem: DataItem) => void;
  removeItem: (shortId: string) => void;
  items: EditDataItem[];
  current: string;
  setCurrent: Setter<string>;
};

const EditContext = createContext<EditContextType>(undefined);

export const EditContextProvider: React.FC = ({ children }) => {
  const [successInfo, setSuccessInfo] = useState<undefined | SuccessInfo>();
  const [isSaving, setIsSaving] = useState(false);
  const [location, setLocation] = useState(''); // only for note
  const [comment, setComment] = useState('');
  const { items, addItem, removeItem } = useEditItems();
  const [current, setCurrent] = useState<ShortId>(''); // to get currentItem - use `useCurrentItem()`

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

export const useCurrentItem = (): EditDataItem => {
  const { items, current } = useEditContext();

  return items.find((item) => item.shortId === current);
};
