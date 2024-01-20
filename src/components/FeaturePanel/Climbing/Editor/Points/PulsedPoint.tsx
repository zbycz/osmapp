import React from 'react';
import styled, { keyframes } from 'styled-components';
import { useClimbingContext } from '../../contexts/ClimbingContext';
import { useConfig } from '../../config';

const pulseAnimation = keyframes`
0% {
  opacity: 0;
  transform: scale(0);
}

30% {
  opacity: 0.3;
  transform: scale(1.5);
}

60% {
  opacity: 0.5;
  transform: scale(3);
}

100% {
  opacity: 0;
  transform: scale(3);
}
`;

const PulsedPointElement = styled.circle`
  animation-name: ${pulseAnimation};
  animation-duration: 3s;
  animation-iteration-count: infinite;
`;

export const PulsedPoint = ({ x, y }) => {
  const { getPixelPosition, imageZoom } = useClimbingContext();
  const position = getPixelPosition({ x, y, units: 'percentage' });

  const config = useConfig();
  return (
    <g
      transform={`translate(${position.x},${position.y}) scale(${
        1 / imageZoom.scale
      })`}
    >
      <PulsedPointElement
        cx="0"
        cy="0"
        id="radarPoint"
        fill={config.pathBorderColor}
        r={3}
      />
    </g>
  );
};
