import React, { createContext, useContext, useState } from 'react';
import Router from 'next/router';
import { isBrowser } from '../../helpers';

interface EditDialogType {
  opened: boolean;
  focusTag: string | boolean;
  open: () => void;
  close: () => void;
  openWithTag: (tag: string) => void;
}

export const EditDialogContext = createContext<EditDialogType>(undefined);

// lives in App.tsx because it needs ctx in SSR
export const EditDialogProvider = ({ children }) => {
  const initialState = isBrowser() ? Router.query.all?.[2] === 'edit' : false; // TODO supply router.query in SSR
  const [openedWithTag, setOpenedWithTag] =
    useState<boolean | string>(initialState);

  const value = {
    opened: !!openedWithTag,
    focusTag: openedWithTag,
    open: () => setOpenedWithTag(true),
    close: () => setOpenedWithTag(false),
    openWithTag: setOpenedWithTag,
  };

  return (
    <EditDialogContext.Provider value={value}>
      {children}
    </EditDialogContext.Provider>
  );
};

export const useEditDialogContext = () => useContext(EditDialogContext);
