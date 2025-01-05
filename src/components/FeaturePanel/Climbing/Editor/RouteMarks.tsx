import React from 'react';
import { Bolt } from './Points/Bolt';
import { Piton } from './Points/Piton';
import { Point } from './Points/Point';
import { PulsedPoint } from './Points/PulsedPoint';
import { Sling } from './Points/Sling';
import { useClimbingContext } from '../contexts/ClimbingContext';
import { Anchor } from './Points/Anchor';
import { ClimbingRoute } from '../types';
import { UnfinishedPoint } from './Points/UnfinishedPoint';

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
    isOtherRouteSelected,
    isEditMode,
  } = useClimbingContext();
  const isSelected = isRouteSelected(routeNumber);
  const isOtherSelected = isOtherRouteSelected(routeNumber);
  return (
    <>
      {getPathForRoute(route).map(({ x, y, type }, index) => {
        const onMarkedPointClick = (e: any) => {
          // @TODO unify with Point.tsx
          if (!isPointMoving) {
            onPointInSelectedRouteClick(e);
            setPointElement(pointElement !== null ? null : e.currentTarget);
            setPointSelectedIndex(index);
            setIsPointMoving(false);
            setIsPointClicked(false);
            e.stopPropagation();
            e.preventDefault();
          }
        };

        const isBoltVisible = !isOtherSelected && type === 'bolt';
        const isAnchorVisible = !isOtherSelected && type === 'anchor';
        const isSlingVisible = !isOtherSelected && type === 'sling';
        const isPitonVisible = !isOtherSelected && type === 'piton';
        const isUnfinishedPointVisible =
          !isOtherSelected && type === 'unfinished';

        const position = getPixelPosition({ x, y, units: 'percentage' });
        const isActualPointSelected = isSelected && isPointSelected(index);
        const pointerEvents = isSelected || isEditMode ? 'auto' : 'none';
        const machine = getMachine();
        const isThisRouteEditOrExtendMode =
          (machine.currentStateName === 'extendRoute' ||
            machine.currentStateName === 'pointMenu' ||
            machine.currentStateName === 'editRoute') &&
          isSelected;

        const xOffset = isSelected && isEditMode ? 15 : 0;
        return (
          // eslint-disable-next-line react/no-array-index-key
          <React.Fragment key={`${routeNumber}-${index}-${x}-${y}`}>
            {isThisRouteEditOrExtendMode && <PulsedPoint x={x} y={y} />}

            {isBoltVisible && (
              <Bolt
                x={position.x + xOffset}
                y={position.y}
                isPointSelected={isActualPointSelected}
                pointerEvents={pointerEvents}
                onClick={onMarkedPointClick}
              />
            )}
            {isPitonVisible && (
              <Piton
                x={position.x + xOffset}
                y={position.y}
                isPointSelected={isActualPointSelected}
                pointerEvents={pointerEvents}
                onClick={onMarkedPointClick}
              />
            )}
            {isSlingVisible && (
              <Sling
                x={position.x}
                y={position.y}
                isPointSelected={isActualPointSelected}
                pointerEvents={pointerEvents}
                onClick={onMarkedPointClick}
              />
            )}
            {isAnchorVisible && (
              <Anchor
                x={position.x + xOffset}
                y={position.y}
                isPointSelected={isActualPointSelected}
                pointerEvents={pointerEvents}
                onClick={onMarkedPointClick}
              />
            )}
            {isUnfinishedPointVisible && (
              <UnfinishedPoint
                x={position.x + xOffset}
                y={position.y}
                isPointSelected={isActualPointSelected}
                pointerEvents={pointerEvents}
                onClick={onMarkedPointClick}
              />
            )}
            <Point
              x={position.x}
              y={position.y}
              type={type}
              onPointInSelectedRouteClick={onPointInSelectedRouteClick}
              index={index}
              routeNumber={routeNumber}
            />
          </React.Fragment>
        );
      })}
    </>
  );
};
