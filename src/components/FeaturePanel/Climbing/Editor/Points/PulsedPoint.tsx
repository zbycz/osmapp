import React from 'react';
import styled from '@emotion/styled';
import { keyframes } from '@emotion/react';

import { useClimbingContext } from '../../contexts/ClimbingContext';
import { useConfig } from '../../config';

const pulseAnimation = keyframes`
0% {
  opacity: 0.5;
  transform: scale(2);
}


50% {
  opacity: 0.6;
  transform: scale(4);
}

100% {
  opacity: 0.5;
  transform: scale(2);
}
`;

const PulsedPointElement = styled.circle`
  animation-name: ${pulseAnimation};
  animation-duration: 8s;
  animation-iteration-count: infinite;
`;

export const PulsedPoint = ({ x, y }) => {
  const { getPixelPosition, photoZoom } = useClimbingContext();
  const position = getPixelPosition({ x, y, units: 'percentage' });

  const config = useConfig();
  return (
    <g
      transform={`translate(${position.x},${position.y}) scale(${
        1 / photoZoom.scale
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
