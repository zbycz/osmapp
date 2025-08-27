import { Dispatch, SetStateAction, useEffect, useState } from 'react';

const getStoredValue = (storageKey: string) =>
  JSON.parse(global?.window?.localStorage.getItem(storageKey) ?? 'null');

const storeValue = <T>(storageKey: string, value: T) =>
  window?.localStorage.setItem(storageKey, JSON.stringify(value));

export const usePersistedState = <T>(
  storageKey: string,
  init: T,
): [T, Dispatch<SetStateAction<T>>] => {
  const [value, setStateValue] = useState<T>(init);

  useEffect(() => {
    // we must set the localStorage value in useEffect to prevent hydration error
    const storedValue = getStoredValue(storageKey);
    if (storedValue != null) {
      setStateValue(storedValue);
    }
  }, [storageKey]);

  const setValue = (param: (prev: T) => T | T) => {
    if (typeof param === 'function') {
      setStateValue((current) => {
        const newValue = param(current);
        storeValue(storageKey, newValue);
        return newValue;
      });
    } else {
      storeValue(storageKey, param);
      setStateValue(param);
    }
  };
  return [value, setValue];
};
