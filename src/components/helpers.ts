import { useCallback, useEffect, useState } from 'react';
import { Map, MapEventType } from 'maplibre-gl';

export const useToggleState = (initialState) => {
  const [value, set] = useState(initialState);
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

export const useMapEffect = (mapEffectFn) => (map, ...rest) =>
  useEffect(() => {
    if (map) {
      mapEffectFn(map, ...rest);
    }
  }, [map, ...rest]);

type EventDefintionFn = (
  map: Map,
  ...rest: any
) => { eventType: keyof MapEventType; eventHandler: any };

export const useAddMapEvent = (getEventDefinition: EventDefintionFn) => (
  map,
  ...rest
) =>
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
