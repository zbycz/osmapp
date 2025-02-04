import React, { createContext, useContext, useState } from 'react';
import Router from 'next/router';
import { isBrowser } from '../../helpers';

type Tag = string;

type EditDialogType = {
  opened: boolean;
  focusTag: boolean | Tag;
  open: () => void;
  close: () => void;
  openWithTag: (tag: Tag) => void;
};

const EditDialogContext = createContext<EditDialogType>(undefined);

// lives in App.tsx because it needs ctx in SSR
export const EditDialogProvider = ({ children }) => {
  const initialState = isBrowser() ? Router.query.all?.[2] === 'edit' : false;
  const [opened, setOpened] = useState<boolean | Tag>(initialState);

  const value: EditDialogType = {
    opened: !!opened,
    focusTag: opened,
    open: () => setOpened(true),
    close: () => setOpened(false),
    openWithTag: (tag: Tag) => setOpened(tag),
  };

  return (
    <EditDialogContext.Provider value={value}>
      {children}
    </EditDialogContext.Provider>
  );
};

export const useEditDialogContext = () => useContext(EditDialogContext);
