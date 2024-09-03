import { useEffect, useState } from 'react';

export const usePersistedState = <T>(
  storageKey: string,
  init: T,
): [T, (param: T | ((current: T) => T)) => void] => {
  const persist = (value) =>
    window?.localStorage.setItem(storageKey, JSON.stringify(value));

  const getVal = () =>
    JSON.parse(global?.window?.localStorage.getItem(storageKey) ?? 'null') ??
    init;

  const eventName = `localStorage-${storageKey}`;

  const [value, setStateValue] = useState(getVal());

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

    if (document) document.dispatchEvent(new Event(eventName));
  };

  useEffect(() => {
    const listener = () => setStateValue(getVal());
    document.addEventListener(eventName, listener);

    return () => document.removeEventListener(eventName, listener);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return [value, setValue];
};
