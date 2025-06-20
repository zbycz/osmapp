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

const setUrlQuery = debounce((value: string) => {
  setSearchUrl(value);
}, 500);

export const useInputValueWithUrl = () => {
  const original = useInputValueState();
  const originalSetInputValue = original.setInputValue;

  const setInputValue = useCallback(
    (value: string) => {
      originalSetInputValue(value);
      setUrlQuery(value);
    },
    [originalSetInputValue],
  );

  return {
    ...original,
    setInputValue,
  };
};

export const useHandleQuery = (
  setInputValue: (value: string) => void,
  setIsOpen: Setter<boolean>,
  valueRef: React.MutableRefObject<string>,
) => {
  const lastSyncedValue = useRef<string | undefined>();
  const router = useRouter();
  useEffect(() => {
    const q = router.query.q;
    if (
      typeof q === 'string' &&
      q !== lastSyncedValue.current && // we don't want to sync one q twice
      q !== valueRef.current // we don't want to sync after we initiated the change of q (with setInputValue->setUrlQuery)
    ) {
      setInputValue(q);
      setIsOpen(true);
      lastSyncedValue.current = q;
    }
  }, [router.query.q, setInputValue, setIsOpen, valueRef]);
};
