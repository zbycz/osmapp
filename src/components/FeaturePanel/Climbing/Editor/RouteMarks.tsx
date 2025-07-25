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
};

export const RouteMarks = ({ route, routeNumber }: Props) => {
  const {
    getPixelPosition,
    isPointSelected,
    getMachine,
    getPathForRoute,
    isRouteSelected,
    isOtherRouteSelected,
    isEditMode,
  } = useClimbingContext();
  const isSelected = isRouteSelected(routeNumber);
  const isOtherSelected = isOtherRouteSelected(routeNumber);
  return (
    <>
      {getPathForRoute(route).map(({ x, y, type }, index) => {
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
                pointIndex={index}
              />
            )}
            {isPitonVisible && (
              <Piton
                x={position.x + xOffset}
                y={position.y}
                isPointSelected={isActualPointSelected}
                pointerEvents={pointerEvents}
                pointIndex={index}
              />
            )}
            {isSlingVisible && (
              <Sling
                x={position.x}
                y={position.y}
                isPointSelected={isActualPointSelected}
                pointerEvents={pointerEvents}
                pointIndex={index}
              />
            )}
            {isAnchorVisible && (
              <Anchor
                x={position.x + xOffset}
                y={position.y}
                isPointSelected={isActualPointSelected}
                pointerEvents={pointerEvents}
                pointIndex={index}
              />
            )}
            {isUnfinishedPointVisible && (
              <UnfinishedPoint
                x={position.x + xOffset}
                y={position.y}
                isPointSelected={isActualPointSelected}
                pointerEvents={pointerEvents}
                pointIndex={index}
              />
            )}
            <Point
              x={position.x}
              y={position.y}
              type={type}
              index={index}
              routeNumber={routeNumber}
            />
          </React.Fragment>
        );
      })}
    </>
  );
};
