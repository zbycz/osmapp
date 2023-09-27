import React, { useContext, useState } from 'react';
import styled from 'styled-components';
import { ClimbingContext } from '../contexts/climbingContext';

const PointElement = styled.circle<{ isHovered: boolean }>`
  transition: all 0.1s ease-in-out;
  ${({ isHovered, isPointSelected }) =>
    `${
      isHovered || isPointSelected
        ? 'transform: scale(1.8);'
        : 'transform: scale(1);'
    }`}
`;

export const Point = ({ x, y, onPointClick, type, index, routeNumber }) => {
  const isBelayVisible = type === 'belay';
  const [isHovered, setIsHovered] = useState(false);
  const [isMoving, setIsMoving] = useState(false);
  const [wasMoved, setWasMoved] = useState(false);
  const {
    imageSize,
    setPointSelectedIndex,
    pointSelectedIndex,
    routeSelectedIndex,
    updateRouteOnIndex,
    editorPosition,
  } = useContext(ClimbingContext);
  const onClick = (e) => {
    e.stopPropagation();
  };

  const onMouseEnter = () => {
    setIsHovered(true);
  };

  const onMouseLeave = () => {
    setIsHovered(false);
  };
  const onMouseDown = () => {
    setPointSelectedIndex(index);
    setIsMoving(true);
  };

  const onMouseUp = (e) => {
    setPointSelectedIndex(null);
    setIsMoving(false);

    if (!wasMoved) {
      onPointClick(e);
      setPointSelectedIndex(index);
    }
    setWasMoved(false);
    e.stopPropagation();
    e.preventDefault();
    return null;
  };
  const onMouseMove = (e) => {
    if (isMoving) {
      setWasMoved(true);
      const newCoordinate = {
        x: (e.clientX - editorPosition.left) / imageSize.width,
        y: (e.clientY - editorPosition.top) / imageSize.height,
      };
      updateRouteOnIndex(routeSelectedIndex, (route) => ({
        ...route,
        path: [
          ...route.path.slice(0, pointSelectedIndex),
          {
            ...route.path[pointSelectedIndex],
            x: newCoordinate.x,
            y: newCoordinate.y,
          },
          ...route.path.slice(pointSelectedIndex + 1),
        ],
      }));
    }
  };

  const isPointSelected =
    routeSelectedIndex === routeNumber && pointSelectedIndex === index;
  const getPointColor = () => {
    if (isBelayVisible) return 'transparent';
    if (isHovered) return 'white';

    return 'white';
  };
  const pointColor = getPointColor();
  return (
    <g transform={`translate(${imageSize.width * x},${imageSize.height * y})`}>
      <circle
        id="clickablePoint"
        cx={0}
        cy={0}
        fill="transparent"
        r={10}
        onClick={onClick}
        cursor="pointer"
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
        onMouseDown={onMouseDown}
        onMouseUp={onMouseUp}
        onMouseMove={onMouseMove}
      >
        {type && <title>{type}</title>}
      </circle>

      <PointElement
        id="coloredPoint"
        cx={0}
        cy={0}
        fill={pointColor}
        stroke={isHovered ? 'rgba(0,0,0,0.3)' : 'royalblue'}
        r={3}
        onClick={onClick}
        cursor="pointer"
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
        onMouseDown={onMouseDown}
        onMouseUp={onMouseUp}
        onMouseMove={onMouseMove}
        isHovered={isHovered}
        isPointSelected={isPointSelected}
      >
        {type && <title>{type}</title>}
      </PointElement>
    </g>
  );
};
