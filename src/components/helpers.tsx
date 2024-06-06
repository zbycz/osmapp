import React, { Fragment, useCallback, useEffect, useState } from 'react';
import { Map, MapEventType } from 'maplibre-gl';
import { useMediaQuery } from '@mui/material';

export const useToggleState = (
  initialState: boolean,
): [boolean, () => void] => {
  const [value, set] = useState<boolean>(initialState);
  return [value, () => set(!value)];
};

export const useBoolState = (initialState) => {
  const [value, set] = useState(initialState);
  const setTrue = useCallback(() => set(true), []);
  const setFalse = useCallback(() => set(false), []);
  return [value, setTrue, setFalse];
};

export const capitalize = (s) => s && s[0].toUpperCase() + s.slice(1);

export function isBrowser() {
  return typeof window !== 'undefined';
}

export function isServer() {
  return typeof window === 'undefined';
}

export const createMapEffectHook =
  (mapEffectFn) =>
  (map, ...rest) =>
    useEffect(() => {
      if (map) {
        mapEffectFn(map, ...rest);
      }
    }, [map, ...rest]);

type EventDefintionFn = (
  map: Map,
  ...rest: any
) => { eventType: keyof MapEventType; eventHandler: any };

export const createMapEventHook =
  (getEventDefinition: EventDefintionFn) =>
  (map, ...rest) =>
    useEffect(() => {
      if (map) {
        const { eventType, eventHandler } = getEventDefinition(map, ...rest);
        map.on(eventType, eventHandler);
        return () => {
          map.off(eventType, eventHandler);
        };
      }
      return undefined;
    }, [map, ...rest]);

export const isString = (value) => typeof value === 'string';

export const slashToOptionalBr = (url) =>
  url.split('/').map((part, idx) => (
    // eslint-disable-next-line react/no-array-index-key
    <Fragment key={idx}>
      {idx > 0 && (
        <>
          /
          <wbr />
        </>
      )}
      {part}
    </Fragment>
  ));

export const dotToOptionalBr = (url = '') =>
  url.split('.').map((part, idx) => (
    // eslint-disable-next-line react/no-array-index-key
    <Fragment key={idx}>
      {idx > 0 && (
        <>
          .
          <wbr />
        </>
      )}
      {part}
    </Fragment>
  ));

export const trimText = (text, limit) =>
  text?.length > limit ? `${text?.substring(0, limit)}…` : text;

// (<= tablet size) MobileMode shows preview instead of panel
export const useMobileMode = () => useMediaQuery('(max-width: 700px)');

// (>= mobile size) This changes just the app layout
export const isDesktop = '(min-width: 500px)';

// is mobile device - specific behaviour like longpress or geouri
export const isMobileDevice = () =>
  isBrowser() && /iPhone|iPad|iPod|Android/i.test(navigator.userAgent); // TODO this can be isomorphic ? otherwise we have hydration error

export const useIsClient = () => {
  const [isClient, setIsClient] = useState(false);
  useEffect(() => {
    setIsClient(true);
  }, []);
  return isClient;
};
