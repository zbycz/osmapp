import React from 'react';
import { useUserThemeContext } from '../../../helpers/theme';
import { use2dContext } from './helpers';
import ArrowUpward from '@mui/icons-material/ArrowUpward';

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

function findMaxRangeStep(
  start: number,
  end: number | undefined,
  max = 30,
): number {
  if (end === undefined) {
    return 0;
  }
  const isFullCircle = start % 360 === end % 360;
  const rangeLength = isFullCircle ? 360 : (end + 360 - start) % 360;

  // Checking for divisors from max down to 1
  for (let i = Math.min(max, rangeLength); i >= 1; i--) {
    if (rangeLength % i === 0) {
      return i;
    }
  }

  return 0;
}

const degreeToRadian = (degrees: number) => degrees * (Math.PI / 180);

type RayProps = {
  centerX: number;
  centerY: number;
  degrees: number;
  ctx: CanvasRenderingContext2D;
  rayLength: number;
  gap: number;
  color: string;
};

const drawRay = ({
  centerX,
  centerY,
  degrees,
  ctx,
  rayLength,
  gap,
  color,
}: RayProps) => {
  const rayWidth = Math.PI / 10;

  const startAngle = degreeToRadian(degrees - 90);
  ctx.beginPath();
  ctx.strokeStyle = color;
  ctx.lineWidth = rayLength;
  ctx.arc(
    centerX,
    centerY,
    gap + rayLength / 2,
    startAngle - rayWidth / 2,
    startAngle + rayWidth / 2,
  );
  ctx.stroke();
};

const DirectionIndicator = ({ start, end }: { start: number; end: number }) => {
  const canvas = React.useRef<HTMLCanvasElement>();
  const [color, setColor] = React.useState('#000');
  const { currentTheme } = useUserThemeContext();
  React.useEffect(() => {
    setColor(currentTheme === 'light' ? '#000' : '#fff');
  }, [currentTheme]);

  use2dContext(
    canvas,
    (ctx, { width: canvasWidth, height: canvasHeight }) => {
      const centerX = canvasWidth / 2;
      const centerY = canvasHeight / 2;
      const radius = canvasHeight / 10;
      const gap = canvasHeight / 10;
      const rayLength = (canvasWidth / 20) * 7;

      const ray = (angle: number) =>
        drawRay({
          degrees: angle,
          rayLength,
          centerX,
          centerY,
          ctx,
          color,
          gap: radius / 2 + gap,
        });

      ctx.beginPath();
      ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
      ctx.fillStyle = color;
      ctx.fill();

      const rangeStep = findMaxRangeStep(start, end);
      const isFullcircle = start % 360 === end % 360;
      const angleInrease = (angle: number, rangeStep: number) => {
        if (isFullcircle) {
          return angle + rangeStep;
        }
        return (angle + rangeStep) % 360;
      };

      for (
        let angle = start;
        angle !== end;
        angle = angleInrease(angle, rangeStep)
      ) {
        ray(angle);
      }
      ray(end);
    },
    [start, end, color],
  );

  return <canvas ref={canvas} width="30" height="30" />;
};

type IndicatorProps = {
  start: number;
  end?: number;
};

const Indicator = ({ start, end }: IndicatorProps) => {
  if (end === undefined) {
    return <ArrowUpward style={{ transform: `rotate(${start}deg)` }} />;
  }

  return <DirectionIndicator start={start} end={end} />;
};

export const DirectionValue: React.FC<{ v: string }> = ({ children, v }) => {
  try {
    const directions = v
      .split(';')
      .map((d) => d.split('-', 2).map(parseCardinal));

    return (
      <span
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
        }}
      >
        {directions.map(([start, end]) => (
          <Indicator start={start} end={end} key={`${start}-${end}`} />
        ))}
        {children}
      </span>
    );
  } catch {
    return <>{children}</>;
  }
};
