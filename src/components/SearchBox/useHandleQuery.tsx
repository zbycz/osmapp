import { Setter } from '../../types';
import Router, { useRouter } from 'next/router';
import React, { useCallback, useEffect, useRef } from 'react';
import { debounce } from 'lodash';
import { useInputValueState } from './options/geocoder';

export const setSearchUrl = (value: string) => {
  const query = value ? `?q=${encodeURIComponent(value)}` : '';

  if (window.location.pathname === '/') {
    Router.push(`/${query}${window.location.hash}`);
  }
};

const setUrlQuery = debounce(
  (value: string, lastSyncedValue: React.MutableRefObject<string>) => {
    setSearchUrl(value);
    lastSyncedValue.current = value; // we ignore this in useHandleQuery
  },
  500,
);

export const useInputValueWithUrl = () => {
  const original = useInputValueState();
  const originalSetInputValue = original.setInputValue;
  const lastSyncedValue = useRef<string | undefined>();

  const setInputValue = useCallback(
    (value: string) => {
      originalSetInputValue(value);
      setUrlQuery(value, lastSyncedValue);
    },
    [originalSetInputValue],
  );

  return {
    ...original,
    setInputValue,
    lastSyncedValue,
  };
};

export const useHandleQuery = (
  setInputValue: (value: string) => void,
  setIsOpen: Setter<boolean>,
  lastSyncedValue: React.MutableRefObject<string>,
) => {
  const router = useRouter();
  useEffect(() => {
    const q = router.query.q;
    if (typeof q === 'string' && q !== lastSyncedValue.current) {
      setInputValue(q);
      setIsOpen(true);
    }
  }, [router.query.q, lastSyncedValue, setInputValue, setIsOpen]);
};
