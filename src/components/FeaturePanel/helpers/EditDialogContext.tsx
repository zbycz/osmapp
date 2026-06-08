import React, { createContext, useContext, useEffect, useState } from 'react';
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

const getFeatureEditUrl = () => {
  const path = Router.query.all as string[] | undefined;
  if (path?.[0]?.match(/^node|way|relation$/) && path?.[1]?.match(/^\d+$/)) {
    return { featureUrl: `/${path[0]}/${path[1]}`, editUrl: `/${path[0]}/${path[1]}/edit` };
  }
  return null;
};

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
    } else if ((Router.query.all as string[])?.[2] === 'edit') {
      const urls = getFeatureEditUrl();
      if (urls) {
        Router.replace(urls.featureUrl, undefined, { shallow: true });
      }
    }
    setOpened(false);
    setRedirectOnClose(undefined);
  };

  const openEdit = (value: boolean | Tag) => {
    const urls = getFeatureEditUrl();
    if (urls && (Router.query.all as string[])?.[2] !== 'edit') {
      Router.push(urls.editUrl, undefined, { shallow: true });
    }
    setOpened(value);
  };

  // Handle static export: fakeStaticExportStartup navigates to the actual URL after
  // mount, so initialState may have been computed before the router was ready.
  useEffect(() => {
    const syncWithUrl = () => {
      if ((Router.query.all as string[])?.[2] === 'edit') {
        setOpened((prev) => prev || true);
      }
    };

    syncWithUrl(); // catch case where router wasn't ready at mount
    Router.events.on('routeChangeComplete', syncWithUrl);
    return () => Router.events.off('routeChangeComplete', syncWithUrl);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const value: EditDialogType = {
    opened: !!opened,
    focusTag: opened,
    open: () => openEdit(true),
    openWithTag: (tag: Tag) => openEdit(tag),
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
