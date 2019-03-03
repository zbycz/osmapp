// @flow

import * as React from 'react';

export const useToggleState = initialState => {
  const [value, set] = React.useState(initialState);
  return [value, () => set(!value)];
};

export const useBoolState = initialState => {
  const [value, set] = React.useState(initialState);
  return [value, () => set(true), () => set(false)];
};

export const capitalize = s => s && s[0].toUpperCase() + s.slice(1);

export function isBrowser() {
  return typeof window !== 'undefined';
}

export function isServer() {
  return typeof window === 'undefined';
}
