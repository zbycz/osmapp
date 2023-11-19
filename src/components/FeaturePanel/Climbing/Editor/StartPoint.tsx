import React from 'react';
import { RouteNumber } from './RouteNumber';
import { useClimbingContext } from '../contexts/ClimbingContext';
import { Point } from './Point';
import { MouseTrackingLine } from './MouseTrackingLine';

type Props = {
  x: number;
  y: number;
  routeNumber: number;
  onPointClick: (event: React.MouseEvent<any>) => void;
};

const NonEditablePoint = ({ x, y, isSelected }) => (
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
  </>
);

export const StartPoint = ({ x, y, routeNumber, onPointClick }: Props) => {
  const { isRouteSelected, useMachine } = useClimbingContext();
  const isSelected = isRouteSelected(routeNumber);
  const machine = useMachine();

  return (
    <>
      {machine.currentStateName === 'extendRoute' ? (
        <Point
          x={x}
          y={y}
          onPointClick={onPointClick}
          index={0}
          routeNumber={routeNumber}
          type={undefined}
        />
      ) : (
        <NonEditablePoint isSelected={isSelected} x={x} y={y} />
      )}
      <MouseTrackingLine routeNumber={routeNumber} />
      <RouteNumber x={x} y={y}>
        {routeNumber}
      </RouteNumber>
    </>
  );
};
