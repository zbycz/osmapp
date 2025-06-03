import { Dispatch, SetStateAction, useState } from 'react';

export const usePersistedState = <T>(
  storageKey: string,
  init: T,
): [T, Dispatch<SetStateAction<T>>] => {
  const persist = (value: T) =>
    window?.localStorage.setItem(storageKey, JSON.stringify(value));

  const initialState = () =>
    JSON.parse(global?.window?.localStorage.getItem(storageKey) ?? 'null') ??
    init;
  const [value, setStateValue] = useState<T>(initialState);

  const setValue = (param: (prev: T) => T | T) => {
    if (typeof param === 'function') {
      setStateValue((current) => {
        const newValue = param(current);
        persist(newValue);
        return newValue;
      });
    } else {
      persist(param);
      setStateValue(param);
    }
  };
  return [value, setValue];
};
