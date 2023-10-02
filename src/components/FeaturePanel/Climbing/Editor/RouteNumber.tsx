/* eslint-disable react/jsx-props-no-spreading */
import React, { useContext } from 'react';
import styled from 'styled-components';
import { ClimbingContext } from '../contexts/climbingContext';

type Props = {
  onClick: (routeNumber: number) => void;
  routeSelectedIndex: number;
  children: number;
  x: number;
  y: number;
};

const RouteNameBoxBase = styled.rect`
  pointer-events: all;
`;

const HoverableRouteName = RouteNameBoxBase;
const RouteNameOutline = RouteNameBoxBase;
const RouteNameBox = RouteNameBoxBase;

export const RouteNumber = ({
  onClick,
  children: routeNumber,
  x,
  y,
  routeSelectedIndex,
}: Props) => {
  const RECT_WIDTH = String(routeNumber).length * 5 + 15;
  const RECT_HEIGHT = 20;
  const RECT_Y_OFFSET = 10;
  const OUTLINE_WIDTH = 2;
  const HOVER_WIDTH = 10;

  const { imageSize } = useContext(ClimbingContext);
  const newY = // this shifts Y coordinate in case of too small photo
    y + RECT_Y_OFFSET + RECT_HEIGHT > imageSize.height
      ? imageSize.height - RECT_HEIGHT - OUTLINE_WIDTH
      : y + RECT_Y_OFFSET;

  const commonProps = {
    onClick: (e) => {
      onClick(routeNumber);
      e.stopPropagation();
    },
    cursor: 'pointer',
  };
  const isSelected = routeSelectedIndex === routeNumber;

  return (
    <>
      <HoverableRouteName
        x={x - RECT_WIDTH / 2 - HOVER_WIDTH / 2}
        y={newY - HOVER_WIDTH / 2}
        width={RECT_WIDTH + HOVER_WIDTH}
        height={RECT_HEIGHT + HOVER_WIDTH}
        rx="10"
        fill="transparent"
        {...commonProps}
      />

      <RouteNameOutline
        x={x - RECT_WIDTH / 2 - OUTLINE_WIDTH / 2}
        y={newY - OUTLINE_WIDTH / 2}
        width={RECT_WIDTH + OUTLINE_WIDTH}
        height={RECT_HEIGHT + OUTLINE_WIDTH}
        rx="10"
        fill={isSelected ? 'white' : '#666'}
        {...commonProps}
      />
      <RouteNameBox
        x={x - RECT_WIDTH / 2}
        y={newY}
        width={RECT_WIDTH}
        height={RECT_HEIGHT}
        rx="10"
        fill={isSelected ? 'royalblue' : 'white'}
        {...commonProps}
      />
      <text
        x={x}
        y={newY + 15}
        fill={isSelected ? 'white' : '#666'}
        textAnchor="middle"
        fontWeight="bold"
        {...commonProps}
      >
        {routeNumber}
      </text>
    </>
  );
};
