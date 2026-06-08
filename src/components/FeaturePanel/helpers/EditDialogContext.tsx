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

const EDIT_DEEPLINK_REGEX =
  /^\/(?:[a-z]{2}\/)?(?:node|way|relation)\/\d+\/edit\/?$/i;

const isEditDeeplink = () => {
  if (Router.query.all?.[2] === 'edit') {
    return true;
  }
  // hacky static export:
  return EDIT_DEEPLINK_REGEX.test(window.location.pathname);
};

// when the dialog was opened via the /edit deeplink, drop the suffix on close
const removeEditDeeplink = () => {
  if (!isBrowser()) {
    return;
  }
  const { pathname, search, hash } = window.location;
  if (EDIT_DEEPLINK_REGEX.test(pathname)) {
    const cleanPathname = pathname.replace(/\/edit\/?$/, '');
    Router.replace(`${cleanPathname}${search}${hash}`, undefined, {
      shallow: true,
    });
  }
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
    } else {
      removeEditDeeplink();
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
