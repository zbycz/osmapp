/* eslint-disable react/jsx-props-no-spreading */
import React from 'react';
import styled from 'styled-components';

type Props = {
  onRouteSelect: (routeNumber: number) => void;
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
  onRouteSelect,
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

  const commonProps = {
    onClick: (e) => {
      onRouteSelect(routeNumber);
      e.stopPropagation();
    },
    cursor: 'pointer',
  };
  const isSelected = routeSelectedIndex === routeNumber;

  return (
    <>
      <HoverableRouteName
        x={x - RECT_WIDTH / 2 - HOVER_WIDTH / 2}
        y={y + RECT_Y_OFFSET - HOVER_WIDTH / 2}
        width={RECT_WIDTH + HOVER_WIDTH}
        height={RECT_HEIGHT + HOVER_WIDTH}
        rx="10"
        fill="transparent"
        {...commonProps}
      />

      <RouteNameOutline
        x={x - RECT_WIDTH / 2 - OUTLINE_WIDTH / 2}
        y={y + RECT_Y_OFFSET - OUTLINE_WIDTH / 2}
        width={RECT_WIDTH + OUTLINE_WIDTH}
        height={RECT_HEIGHT + OUTLINE_WIDTH}
        rx="10"
        fill={isSelected ? 'white' : '#666'}
        {...commonProps}
      />
      <RouteNameBox
        x={x - RECT_WIDTH / 2}
        y={y + RECT_Y_OFFSET}
        width={RECT_WIDTH}
        height={RECT_HEIGHT}
        rx="10"
        fill={isSelected ? 'royalblue' : 'white'}
        {...commonProps}
      />
      <text
        x={x}
        y={y + RECT_Y_OFFSET + 15}
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
