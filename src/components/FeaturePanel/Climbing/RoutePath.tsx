/* eslint-disable react/jsx-props-no-spreading */
import React from 'react';
import type { PathPoints } from './types';

const IMAGE_WIDTH = 410;
const IMAGE_HEIGHT = 540;

type Props = {
  route: PathPoints;
  routeSelected: number;
  routeNumber: number;
  onRouteSelect: (routeNumber: number) => void;
  isEditable: boolean;
};

export const RoutePath = ({
  route,
  routeSelected,
  routeNumber,
  onRouteSelect,
  isEditable,
}: Props) => {
  const pointsInString = route.map(({ x, y }, index) => {
    const currentX = IMAGE_WIDTH * x;
    const currentY = IMAGE_HEIGHT * y;
    return `${index === 0 ? 'M' : 'L'}${currentX} ${currentY} `;
  });

  const commonProps = isEditable
    ? {}
    : {
        onClick: (e) => {
          onRouteSelect(routeNumber);
          e.stopPropagation();
        },
        cursor: 'pointer',
      };

  return (
    <>
      <path
        d={`M0 0 ${pointsInString}`}
        strokeWidth={15}
        stroke="transparent"
        strokeLinecap="round"
        fill="none"
        {...commonProps}
      />
      <path
        d={`M0 0 ${pointsInString}`}
        strokeWidth={8}
        stroke="white"
        strokeLinecap="round"
        fill="none"
        {...commonProps}
      />
      <path
        d={`M0 0 ${pointsInString}`}
        strokeWidth={5}
        stroke={routeSelected === routeNumber ? 'red' : 'black'}
        strokeLinecap="round"
        fill="none"
        {...commonProps}
      />
    </>
  );
};
