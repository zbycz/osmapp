import React from 'react';
import { RouteNumber } from './RouteNumber';
import { useClimbingContext } from '../contexts/ClimbingContext';
import { Point } from './Point';
import { MouseTrackingLine } from './MouseTrackingLine';
import { useConfig } from '../config';

type Props = {
  x: number;
  y: number;
  routeNumber: number;
  onPointInSelectedRouteClick: (event: React.MouseEvent<any>) => void;
};

const NonEditablePoint = ({ x, y, isSelected }) => {
  const config = useConfig();
  return (
    <>
      <circle
        cx={x}
        cy={y}
        r={4}
        strokeWidth="0"
        fill={
          isSelected ? config.pathBorderColorSelected : config.pathBorderColor
        }
      />
      <circle
        cx={x}
        cy={y}
        r={2.5}
        strokeWidth="0"
        fill={
          isSelected ? config.pathStrokeColorSelected : config.pathStrokeColor
        }
      />
    </>
  );
};

export const StartPoint = ({
  x,
  y,
  routeNumber,
  onPointInSelectedRouteClick,
}: Props) => {
  const { isRouteSelected, getMachine } = useClimbingContext();
  const isSelected = isRouteSelected(routeNumber);
  const machine = getMachine();

  return (
    <>
      {machine.currentStateName === 'editRoute' ||
      machine.currentStateName === 'extendRoute' ? (
        <Point
          x={x}
          y={y}
          onPointInSelectedRouteClick={onPointInSelectedRouteClick}
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
