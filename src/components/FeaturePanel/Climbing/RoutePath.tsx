/* eslint-disable react/jsx-props-no-spreading */
import React, { useContext } from 'react';
import type { PathPoints } from './types';
import { ClimbingEditorContext } from './contexts/climbingEditorContext';

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
  const { imageSize } = useContext(ClimbingEditorContext);
  const pointsInString = route.map(({ x, y }, index) => {
    const currentX = imageSize.width * x;
    const currentY = imageSize.height * y;
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
        strokeWidth={10}
        stroke="transparent"
        strokeLinecap="round"
        fill="none"
        {...commonProps}
      />
      <path
        d={`M0 0 ${pointsInString}`}
        strokeWidth={5}
        stroke={routeSelected === routeNumber ? 'white' : '#666'}
        strokeLinecap="round"
        fill="none"
        {...commonProps}
      />
      <path
        d={`M0 0 ${pointsInString}`}
        strokeWidth={3}
        stroke={routeSelected === routeNumber ? 'royalblue' : 'white'}
        strokeLinecap="round"
        fill="none"
        {...commonProps}
      />
    </>
  );
};
