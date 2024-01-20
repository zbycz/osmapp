import React from 'react';
import { Bolt } from './Points/Bolt';
import { Piton } from './Points/Piton';
import { Point } from './Points/Point';
import { PulsedPoint } from './Points/PulsedPoint';
import { Sling } from './Points/Sling.1';
import { useClimbingContext } from '../contexts/ClimbingContext';
import { Anchor } from './Points/Anchor';
import { ClimbingRoute } from '../types';

type Props = {
  route: ClimbingRoute;
  routeNumber: number;
  onPointInSelectedRouteClick: (event: React.MouseEvent<any>) => void;
};

export const RouteMarks = ({
  route,
  routeNumber,
  onPointInSelectedRouteClick,
}: Props) => {
  const {
    getPixelPosition,
    isPointSelected,
    getMachine,
    getPathForRoute,
    isRouteSelected,
    pointElement,
    isPointMoving,
    setPointElement,
    setPointSelectedIndex,
    setIsPointMoving,
    setIsPointClicked,
  } = useClimbingContext();
  const isSelected = isRouteSelected(routeNumber);

  return (
    <>
      {getPathForRoute(route).map(({ x, y, type }, index) => {
        const handleClick = (e: any) => {
          // @TODO unify with Point.tsx
          if (!isPointMoving) {
            console.log('________onMouseUp');
            setPointSelectedIndex(null);
            onPointInSelectedRouteClick(e);
            setPointElement(pointElement !== null ? null : e.currentTarget);
            setPointSelectedIndex(index);
            setIsPointMoving(false);
            setIsPointClicked(false);
            e.stopPropagation();
            e.preventDefault();
          }
        };

        const isBoltVisible = type === 'bolt';
        const isAnchorVisible = type === 'anchor';
        const isSlingVisible = type === 'sling';
        const isPitonVisible = type === 'piton';
        const position = getPixelPosition({ x, y, units: 'percentage' });
        const isActualPointSelected = isSelected && isPointSelected(index);
        const pointerEvents = isSelected ? 'auto' : 'none';
        const machine = getMachine();
        const isThisRouteEditOrExtendMode =
          (machine.currentStateName === 'extendRoute' ||
            machine.currentStateName === 'pointMenu' ||
            machine.currentStateName === 'editRoute') &&
          isSelected;

        return (
          <>
            {isThisRouteEditOrExtendMode && <PulsedPoint x={x} y={y} />}
            {isBoltVisible && (
              <Bolt
                x={position.x}
                y={position.y}
                isPointSelected={isActualPointSelected}
                pointerEvents={pointerEvents}
                onClick={handleClick}
              />
            )}
            {isPitonVisible && (
              <Piton
                x={position.x}
                y={position.y}
                isPointSelected={isActualPointSelected}
                pointerEvents={pointerEvents}
                onClick={handleClick}
              />
            )}
            {isSlingVisible && (
              <Sling
                x={position.x}
                y={position.y}
                isPointSelected={isActualPointSelected}
                pointerEvents={pointerEvents}
                onClick={handleClick}
              />
            )}
            {isAnchorVisible && (
              <Anchor
                x={position.x}
                y={position.y}
                isPointSelected={isActualPointSelected}
                pointerEvents={pointerEvents}
                onClick={handleClick}
              />
            )}
            {isThisRouteEditOrExtendMode && (
              <Point
                x={position.x}
                y={position.y}
                type={type}
                onPointInSelectedRouteClick={onPointInSelectedRouteClick}
                index={index}
                routeNumber={routeNumber}
              />
            )}
          </>
        );
      })}
    </>
  );
};
