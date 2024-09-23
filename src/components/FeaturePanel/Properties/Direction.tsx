import { keyframes } from '@emotion/react';
import styled from '@emotion/styled';
import ArrowUpward from '@mui/icons-material/ArrowUpward';
import React from 'react';

const cardinalMiddle = (angle1: number, angle2: number) => {
  // Add 360 on big difference like NW
  const increse = Math.abs(angle1 - angle2) > 90 ? 360 : 0;

  return ((angle1 + angle2 + increse) / 2) % 360;
};

const parseSingleCardinal = (cardinal: string) => {
  switch (cardinal) {
    case 'N':
      return 0;
    case 'E':
      return 90;
    case 'S':
      return 180;
    case 'W':
      return 270;
    default:
      throw new Error('Invalid');
  }
};

const parseCardinal = (cardinal: string): number => {
  const asInt = parseInt(cardinal);
  if (!Number.isNaN(asInt)) {
    return asInt;
  }

  const sanitized = cardinal
    .replace(/n(orth)?/i, 'N')
    .replace(/e(ast)?/i, 'E')
    .replace(/s(outh)?/i, 'S')
    .replace(/w(est)?/i, 'W');

  if (sanitized.length === 0) {
    throw new Error('Empty cardinal direction');
  }
  if (sanitized.length === 1) {
    return parseSingleCardinal(sanitized);
  }

  return (
    cardinalMiddle(
      parseCardinal(sanitized.slice(0, 1)),
      parseCardinal(sanitized.slice(1)),
    ) % 360
  );
};

const rotateAnimation = (start: number, end: number) => {
  const finalEnd = start > end ? end + 360 : end;

  return keyframes`
    0% {
      transform: rotate(${start}deg);
    }
    100% {
      transform: rotate(${finalEnd}deg);
    }
  `;
};

const AnimatedArrow = styled(ArrowUpward)<{
  start: number;
  end: number;
}>`
  animation: ${({ start, end }) => rotateAnimation(start, end)} 4s linear
    infinite alternate;
`;

export const DirectionValue: React.FC<{ v: string }> = ({ children, v }) => {
  try {
    const [start, end] = v.split('-', 2).map(parseCardinal);

    return (
      <span
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.2rem',
        }}
      >
        <AnimatedArrow start={start} end={end ?? start} />
        {children}
      </span>
    );
  } catch {
    return <>{children}</>;
  }
};
