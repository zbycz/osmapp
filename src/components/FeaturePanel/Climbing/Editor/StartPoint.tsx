import React, { useContext } from 'react';
import { RouteNumber } from './RouteNumber';
import { ClimbingContext } from '../contexts/climbingContext';

type Props = {
  x: number;
  y: number;
  onClick: (routeNumber: number) => void;
  routeNumber: number;
};

export const StartPoint = ({ x, y, onClick, routeNumber }: Props) => {
  const { routeSelectedIndex } = useContext(ClimbingContext);
  const isSelected = routeSelectedIndex === routeNumber; // @TODO do contextu
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
      <RouteNumber
        onClick={onClick}
        x={x}
        y={y}
        routeSelectedIndex={routeSelectedIndex}
      >
        {routeNumber}
      </RouteNumber>
    </>
  );
};
