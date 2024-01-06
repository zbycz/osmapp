/* eslint-disable react/jsx-props-no-spreading */
import React from 'react';
import styled from 'styled-components';
import { useClimbingContext } from '../contexts/ClimbingContext';
import { useConfig } from '../config';

type Props = {
  children: number;
  x: number;
  y: number;
};

const Text = styled.text`
  user-select: none;
  font-size: 12px;
  font-family: 'Roboto', sans-serif;
  font-weight: 600;
`;

const RouteNameBoxBase = styled.rect`
  pointer-events: all;
`;

const HoverableRouteName = RouteNameBoxBase;
const RouteNameOutline = RouteNameBoxBase;
const RouteNameBox = RouteNameBoxBase;

export const RouteNumber = ({ children: routeNumber, x, y }: Props) => {
  const digits = String(routeNumber).length;
  const RECT_WIDTH = (digits > 2 ? digits : 0) * 3 + 20;
  const RECT_HEIGHT = 20;
  const RECT_Y_OFFSET = 10;
  const OUTLINE_WIDTH = 2;
  const HOVER_WIDTH = 10;

  const { imageSize, isRouteSelected, getMachine, isEditMode } =
    useClimbingContext();
  const config = useConfig();

  const getX = () => {
    const isFarRight = x + RECT_WIDTH / 2 + OUTLINE_WIDTH > imageSize.width;
    const isFarLeft = x < RECT_WIDTH / 2 + OUTLINE_WIDTH;
    if (isFarRight) {
      return imageSize.width - RECT_WIDTH / 2 - OUTLINE_WIDTH;
    }
    if (isFarLeft) {
      return RECT_WIDTH / 2 + OUTLINE_WIDTH;
    }
    return x;
  };

  const getY = () => {
    const isFarBottom = y + RECT_Y_OFFSET + RECT_HEIGHT > imageSize.height;
    if (isFarBottom) return imageSize.height - RECT_HEIGHT - OUTLINE_WIDTH;
    return y + RECT_Y_OFFSET;
  };

  const newX = getX(); // this shifts X coordinate in case of too small photo
  const newY = getY(); // this shifts Y coordinate in case of too small photo

  const machine = getMachine();
  const commonProps = {
    onClick: (e) => {
      if (isEditMode) {
        machine.execute('editRoute', { routeNumber });
      } else {
        machine.execute('routeSelect', { routeNumber });
      }
      e.stopPropagation();
    },
    cursor: 'pointer',
  };
  const isSelected = isRouteSelected(routeNumber);

  return (
    <>
      <HoverableRouteName
        x={newX - RECT_WIDTH / 2 - HOVER_WIDTH / 2}
        y={newY - HOVER_WIDTH / 2}
        width={RECT_WIDTH + HOVER_WIDTH}
        height={RECT_HEIGHT + HOVER_WIDTH}
        rx="10"
        fill="transparent"
        {...commonProps}
      />

      <RouteNameOutline
        x={newX - RECT_WIDTH / 2 - OUTLINE_WIDTH / 2}
        y={newY - OUTLINE_WIDTH / 2}
        width={RECT_WIDTH + OUTLINE_WIDTH}
        height={RECT_HEIGHT + OUTLINE_WIDTH}
        rx="10"
        fill={
          isSelected
            ? config.routeNumberBorderColorSelected
            : config.routeNumberBorderColor
        }
        {...commonProps}
      />
      <RouteNameBox
        x={newX - RECT_WIDTH / 2}
        y={newY}
        width={RECT_WIDTH}
        height={RECT_HEIGHT}
        rx="10"
        fill={
          isSelected
            ? config.routeNumberBackgroundSelected
            : config.routeNumberBackground
        }
        {...commonProps}
      />
      <Text
        x={newX}
        y={newY + 15}
        fill={
          isSelected
            ? config.routeNumberTextColorSelected
            : config.routeNumberTextColor
        }
        textAnchor="middle"
        {...commonProps}
      >
        {routeNumber + 1}
      </Text>
    </>
  );
};
