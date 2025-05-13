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
  redirectOnClose: string | undefined;
  setRedirectOnClose: (url: string | undefined) => void;
};

const EditDialogContext = createContext<EditDialogType>(undefined);

// lives in App.tsx because the context is needed in SSR
export const EditDialogProvider = ({ children }) => {
  const initialState = isBrowser() ? Router.query.all?.[2] === 'edit' : false;
  const [opened, setOpened] = useState<boolean | Tag>(initialState);
  const [redirectOnClose, setRedirectOnClose] = useState<string | undefined>();

  const close = () => {
    if (redirectOnClose) {
      Router.replace('/').then(() => {
        Router.replace(redirectOnClose); // to reload the panel, we need two redirects, see https://github.com/zbycz/osmapp/pull/685
      });
    }
    setOpened(false);
    setRedirectOnClose(undefined);
  };

  const value: EditDialogType = {
    opened: !!opened,
    focusTag: opened,
    open: () => setOpened(true),
    openWithTag: (tag: Tag) => setOpened(tag),
    close,
    redirectOnClose,
    setRedirectOnClose,
  };

  return (
    <EditDialogContext.Provider value={value}>
      {children}
    </EditDialogContext.Provider>
  );
};

export const useEditDialogContext = () => useContext(EditDialogContext);
