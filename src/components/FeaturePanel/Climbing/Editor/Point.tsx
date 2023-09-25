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
  const {
    imageSize,
    setPointSelectedIndex,
    pointSelectedIndex,
    routeSelectedIndex,
  } = useContext(ClimbingContext);
  const onClick = (e) => {
    onPointClick(e);
    setPointSelectedIndex(index);
    e.stopPropagation();
  };

  const onMouseEnter = () => {
    setIsHovered(true);
  };

  const onMouseLeave = () => {
    setIsHovered(false);
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
        isHovered={isHovered}
        isPointSelected={isPointSelected}
      >
        {type && <title>{type}</title>}
      </PointElement>
    </g>
  );
};
