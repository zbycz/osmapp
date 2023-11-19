/* eslint-disable react/jsx-props-no-spreading */
import React from 'react';
import styled from 'styled-components';

const RouteLine = styled.path``;
const RouteBorder = styled.path``;

export const PathWithBorder = ({ d, isSelected, ...props }) => (
  <>
    <RouteBorder
      d={d}
      strokeWidth={5}
      stroke={isSelected ? 'white' : '#666'}
      strokeLinecap="round"
      fill="none"
      opacity={0.8}
      {...props}
    />
    <RouteLine
      d={d}
      strokeWidth={3}
      stroke={isSelected ? 'royalblue' : 'white'}
      strokeLinecap="round"
      fill="none"
      pointerEvents="none"
      {...props}
    />
  </>
);
