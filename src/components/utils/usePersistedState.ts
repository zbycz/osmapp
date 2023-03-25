import { useState } from 'react';

export const usePersistedState = <T>(
  storageKey: string,
  init: T,
): [T, (param: T | ((current: T) => T)) => void] => {
  const persist = (value) =>
    window?.localStorage.setItem(storageKey, JSON.stringify(value));

  const [value, setStateValue] = useState(
    JSON.parse(global?.window?.localStorage.getItem(storageKey) ?? 'null') ??
      init,
  );

  const setValue = (param) => {
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
