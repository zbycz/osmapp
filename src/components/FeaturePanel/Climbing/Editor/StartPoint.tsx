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
  onPointInSelectedRouteClick: (event: React.MouseEvent<any>) => void;
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
  onPointInSelectedRouteClick,
}: Props) => {
  const { isRouteSelected, getMachine, isOtherRouteSelected, isPointSelected } =
    useClimbingContext();
  const isSelected = isRouteSelected(routeNumber);
  const isOtherSelected = isOtherRouteSelected(routeNumber);
  const machine = getMachine();
  const isPointOnRouteSelected =
    isRouteSelected && isPointSelected(routeNumber);
  return (
    <>
      {isSelected &&
      (machine.currentStateName === 'editRoute' ||
        machine.currentStateName === 'extendRoute') ? (
        <Point
          x={x}
          y={y}
          onPointInSelectedRouteClick={onPointInSelectedRouteClick}
          index={0}
          routeNumber={routeNumber}
          type={undefined}
          isRouteSelected={isSelected}
          isOtherRouteSelected={isOtherSelected}
          isPointSelected={isPointOnRouteSelected}
        />
      ) : (
        <NonEditablePoint isSelected={isSelected} x={x} y={y} />
      )}
      <MouseTrackingLine routeNumber={routeNumber} />
      <RouteNumber x={x + routeNumberXShift} y={y} osmId={osmId}>
        {routeNumber}
      </RouteNumber>
    </>
  );
};
