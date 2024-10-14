import React, { Fragment, useCallback, useEffect, useState } from 'react';
import { Map, MapEventType } from 'maplibre-gl';
import { useMediaQuery } from '@mui/material';

export const useToggleState = (
  initialState: boolean,
): [boolean, () => void] => {
  const [value, set] = useState<boolean>(initialState);
  const toggle = useCallback(() => set((prevValue) => !prevValue), []);
  return [value, toggle];
};

export const useBoolState = (
  initialState: boolean,
): [boolean, () => void, () => void] => {
  const [value, set] = useState(initialState);
  const setTrue = useCallback(() => set(true), []);
  const setFalse = useCallback(() => set(false), []);
  return [value, setTrue, setFalse];
};

export const capitalize = (s: string) => s && s[0].toUpperCase() + s.slice(1);

export function isBrowser() {
  return typeof window !== 'undefined';
}

export function isServer() {
  return typeof window === 'undefined';
}

type MapEffect<T extends any[]> = (map: Map, ...rest: T) => void;

export const createMapEffectHook =
  <T extends any[]>(mapEffectFn: MapEffect<T>) =>
  (map: Map | undefined, ...rest: T): void =>
    useEffect(() => {
      if (!map) {
        return;
      }

      mapEffectFn(map, ...rest);
    }, [map, ...rest]); // eslint-disable-line react-hooks/exhaustive-deps

type MapEvent = keyof MapEventType;
export type MapEventHandler<T extends MapEvent> = (
  ev: MapEventType[T] & Object,
) => void;
type EventDefintionFn<E extends MapEvent, P extends any[]> = (
  map: Map,
  ...rest: P
) => { eventType: E; eventHandler: MapEventHandler<E> };

export const createMapEventHook =
  <E extends MapEvent, P extends any[]>(
    getEventDefinition: EventDefintionFn<E, P>,
  ) =>
  (map: Map | undefined, ...rest: P) =>
    useEffect(() => {
      if (!map) {
        return undefined;
      }

      const { eventType, eventHandler } = getEventDefinition(map, ...rest);
      map.on(eventType, eventHandler);
      return () => {
        map.off(eventType, eventHandler);
      };
    }, [map, ...rest]); // eslint-disable-line react-hooks/exhaustive-deps

export const isString = (value: unknown): value is string =>
  typeof value === 'string';

export const slashToOptionalBr = (url: string) =>
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

export const trimText = (text: string, limit: number) =>
  text?.length > limit ? `${text?.substring(0, limit)}…` : text;

// (<= tablet size) MobileMode shows FeaturePanel in Drawer (instead of side)
export const isMobileMode = '(max-width: 700px)';
export const useMobileMode = () => useMediaQuery(isMobileMode);
export const isMobileModeVanilla = () => window.innerWidth <= 700;

// (>= mobile size) SearchBox stops growing
export const isDesktop = '(min-width: 500px)';

// TODO refactor breakpoints later
export const isTabletResolution = '(min-width: 501px)';
export const isDesktopResolution = '(min-width: 701px)';

// is mobile device - specific behaviour like longpress or geouri
export const isMobileDevice = () =>
  isBrowser() && /iPhone|iPad|iPod|Android/i.test(navigator.userAgent); // TODO lets make it isomorphic. Otherwise we have hydration error

export const useIsClient = () => {
  const [isClient, setIsClient] = useState(false);
  useEffect(() => {
    setIsClient(true);
  }, []);
  return isClient;
};

export const DotLoader = () => (
  <>
    <span className="dotloader">.</span>
    <span className="dotloader">.</span>
    <span className="dotloader">.</span>
  </>
);

// TODO import { NoSsr } from '@mui/base';
export const ClientOnly = ({ children }) => {
  const isClient = useIsClient();
  return isClient ? children : null;
};

export const isImperial = () =>
  window.localStorage.getItem('imperial') === 'yes';

export const toggleImperial = () => {
  localStorage.setItem('imperial', isImperial() ? '' : 'yes');
};
