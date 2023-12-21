/* eslint-disable react/jsx-props-no-spreading */
import React from 'react';
import styled from 'styled-components';
import { useConfig } from '../config';

const RouteLine = styled.path``;
const RouteBorder = styled.path``;

export const PathWithBorder = ({ d, isSelected, ...props }) => {
  const config = useConfig();
  return (
    <>
      <RouteBorder
        d={d}
        strokeWidth={config.pathBorderWidth}
        stroke={
          isSelected ? config.pathBorderColorSelected : config.pathBorderColor
        }
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
        opacity={config.pathBorderOpacity}
        {...props}
      />
      <RouteLine
        d={d}
        strokeWidth={config.pathStrokeWidth}
        stroke={
          isSelected ? config.pathStrokeColorSelected : config.pathStrokeColor
        }
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
        pointerEvents="none"
        {...props}
      />
    </>
  );
};
