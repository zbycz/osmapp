import { useEffect, useState } from 'react';

export const usePersistedState = <T>(
  storageKey: string,
  init: T | (() => T),
): [T, (param: T | ((current: T) => T)) => void] => {
  const persist = (value) =>
    window?.localStorage.setItem(storageKey, JSON.stringify(value));

  const [value, setStateValue] = useState(init);

  useEffect(() => {
    const storedValue = window?.localStorage.getItem(storageKey);
    if (storedValue !== null) {
      setStateValue(JSON.parse(storedValue));
    }
  }, [storageKey]);

  const setValue = (setterOrValue) => {
    if (typeof setterOrValue === 'function') {
      setStateValue((current) => {
        const newValue = setterOrValue(current);
        persist(newValue);
        return newValue;
      });
    } else {
      persist(setterOrValue);
      setStateValue(setterOrValue);
    }
  };
  return [value, setValue];
};
