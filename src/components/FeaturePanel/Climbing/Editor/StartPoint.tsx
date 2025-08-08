import React from 'react';
import { RouteNumber } from './RouteNumber';
import { useClimbingContext } from '../contexts/ClimbingContext';
import { Point } from './Points/Point';
import { MouseTrackingLine } from './MouseTrackingLine';
import { useConfig } from '../config';

type Props = {
  x: number;
  y: number;
  routeNumberXShift: number;
  routeNumber: number;
  osmId: string;
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
  routeNumberXShift = 0,
  osmId,
}: Props) => {
  const { isRouteSelected, getMachine } = useClimbingContext();
  const isSelected = isRouteSelected(routeNumber);
  const machine = getMachine();
  return (
    <>
      {isSelected &&
      (machine.currentStateName === 'editRoute' ||
        machine.currentStateName === 'extendRoute') ? (
        <Point
          x={x}
          y={y}
          index={0}
          routeIndex={routeNumber}
          type={undefined}
        />
      ) : (
        <NonEditablePoint isSelected={isSelected} x={x} y={y} />
      )}
      <MouseTrackingLine routeIndex={routeNumber} />
      <RouteNumber x={x + routeNumberXShift} y={y} osmId={osmId}>
        {routeNumber}
      </RouteNumber>
    </>
  );
};
