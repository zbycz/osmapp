import React from 'react';
import { PositionPx, ZoomState } from '../types';

export const getPositionInImageFromMouse = (
  svgRef: React.MutableRefObject<any>,
  mousePosition: PositionPx,
  photoZoom: ZoomState,
) => {
  if (svgRef.current === null || !mousePosition) {
    return null;
  }

  const imageRect = svgRef.current.getBoundingClientRect();

  const posInImage: PositionPx = {
    x: (mousePosition.x - imageRect.x) / photoZoom.scale,
    y: (mousePosition.y - imageRect.y) / photoZoom.scale,
    units: 'px',
  };
  return posInImage;
};

export const getMouseFromPositionInImage = (
  svgRef: React.MutableRefObject<any>,
  position: PositionPx,
  photoZoom: ZoomState,
) => {
  if (svgRef.current === null || !position) {
    return null;
  }

  const imageRect = svgRef.current.getBoundingClientRect();

  return {
    x: position.x * photoZoom.scale + imageRect.x,
    y: position.y * photoZoom.scale + imageRect.y,
    units: 'px',
  };
};
