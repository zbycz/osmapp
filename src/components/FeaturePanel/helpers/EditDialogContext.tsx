import React, { createContext, useContext, useState } from 'react';
import Router from 'next/router';
import { isBrowser } from '../../helpers';
import { Setter } from '../../../types';

type Tag = string;

type EditDialogType = {
  opened: boolean;
  focusTag: boolean | Tag;
  open: () => void;
  close: () => void;
  openWithTag: (tag: Tag) => void;
  redirectOnClose: string | undefined;
  setRedirectOnClose: Setter<string | undefined>;
};

const EditDialogContext = createContext<EditDialogType>(undefined);

const isEditDeeplink = () => {
  if (!isBrowser()) {
    return false;
  }
  if (Router.query.all?.[2] === 'edit') {
    return true;
  }
  // In the hacky static export the page is served from 404.html, so Router.query
  // is not yet populated on the first render – fall back to the real browser URL.
  return /^\/(?:[a-z]{2}\/)?(?:node|way|relation)\/\d+\/edit\/?$/i.test(
    window.location.pathname,
  );
};

// lives in App.tsx because the context is needed in SSR
export const EditDialogProvider = ({ children }) => {
  const initialState = isEditDeeplink();
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
