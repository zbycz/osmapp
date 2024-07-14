import React from 'react';
import { PositionPx, ZoomState } from '../types';

export const getPositionInImageFromMouse = (
  photoRef: React.MutableRefObject<any>,
  mousePosition: PositionPx,
  photoZoom: ZoomState,
) => {
  if (photoRef.current === null || !mousePosition) {
    return null;
  }

  const imageRect = photoRef.current.getBoundingClientRect();

  const posInImage: PositionPx = {
    x: (mousePosition.x - imageRect.x) / photoZoom.scale,
    y: (mousePosition.y - imageRect.y) / photoZoom.scale,
    units: 'px',
  };
  return posInImage;
};

export const getMouseFromPositionInImage = (
  photoRef: React.MutableRefObject<any>,
  position: PositionPx,
  photoZoom: ZoomState,
) => {
  if (photoRef.current === null || !position) {
    return null;
  }

  const imageRect = photoRef.current.getBoundingClientRect();

  return {
    x: position.x * photoZoom.scale + imageRect.x,
    y: position.y * photoZoom.scale + imageRect.y,
    units: 'px',
  };
};
