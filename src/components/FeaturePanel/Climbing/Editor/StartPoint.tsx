import React, { useContext } from 'react';
import { RouteNumber } from './RouteNumber';
import { ClimbingContext } from '../contexts/ClimbingContext';

type Props = {
  x: number;
  y: number;
  routeNumber: number;
};

export const StartPoint = ({ x, y, routeNumber }: Props) => {
  const { isRouteSelected } = useContext(ClimbingContext);
  const isSelected = isRouteSelected(routeNumber);

  return (
    <>
      <circle
        cx={x}
        cy={y}
        r={4}
        strokeWidth="0"
        fill={isSelected ? 'white' : '#666'}
      />
      <circle
        cx={x}
        cy={y}
        r={2.5}
        strokeWidth="0"
        fill={isSelected ? 'royalblue' : 'white'}
      />
      <RouteNumber x={x} y={y}>
        {routeNumber}
      </RouteNumber>
    </>
  );
};
