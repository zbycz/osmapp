import React from 'react';
import styled from 'styled-components';

const IMAGE_WIDTH = 410;
const IMAGE_HEIGHT = 500;

const Svg = styled.svg`
  position: absolute;
  height: 100%;
  width: 100%;
  left: 0;
  top: 0;
`;

const Route = ({ route }) => route.map(({ x, y, type }, index) => {
    const currentX = IMAGE_WIDTH * x;
    const currentY = IMAGE_HEIGHT * y;

    return (
      <>
        <circle
          cx={currentX}
          cy={currentY}
          r={10}
          strokeWidth="0"
          fill={type === 'anchor' ? 'red' : 'blue'}
        />
        {index !== 0 && (
          <line
            strokeWidth={5}
            stroke="red"
            x1={IMAGE_WIDTH * route[index - 1].x}
            y1={IMAGE_HEIGHT * route[index - 1].y}
            x2={currentX}
            y2={currentY}
          />
        )}
      </>
    );
  });

export const RoutePaths = ({ data }) => (
    <Svg>
      {data.map((route) => (
        <Route route={route} />
      ))}
    </Svg>
  );
