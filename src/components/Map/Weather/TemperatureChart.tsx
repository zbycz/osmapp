import React, { useRef, useEffect, useState } from 'react';
import { DetailedWeather } from './loadWeather';
import zip from 'lodash/zip';
import { useUserThemeContext } from '../../../helpers/theme';
import { CoordinateSystem } from './CoordinateSystem';

const FILL_COLOR = 'rgba(250, 204, 21, 0.2)';
const STROKE_COLOR = '#facc15';

type Point = { x: number; y: number };

const generateSmoothPath = ([firstPoint, ...remainingPoints]: Point[]) => {
  return remainingPoints.reduce((acc, point, i) => {
    if (i === remainingPoints.length - 1) {
      return acc + ` T ${point.x} ${point.y}`;
    }

    const nextPoint = remainingPoints[i + 1];
    const midPoint = {
      x: (point.x + nextPoint.x) / 2,
      y: (point.y + nextPoint.y) / 2,
    };

    return acc + ` Q ${point.x} ${point.y}, ${midPoint.x} ${midPoint.y}`;
  }, `M ${firstPoint.x} ${firstPoint.y}`);
};

const evaluateQuadraticBezier = (
  t: number,
  p0: Point,
  p1: Point,
  p2: Point,
): Point => {
  const x = (1 - t) * (1 - t) * p0.x + 2 * (1 - t) * t * p1.x + t * t * p2.x;
  const y = (1 - t) * (1 - t) * p0.y + 2 * (1 - t) * t * p1.y + t * t * p2.y;
  return { x, y };
};

const getBezierHeightForX = (points: Point[], x: number): number | null => {
  if (points.length < 2) {
    return null;
  }

  const pointPairs = zip(points.slice(0, -1), points.slice(1));
  const segment = pointPairs.find(([p0, p1]) => p0.x <= x && x <= p1.x);
  if (!segment) {
    return null;
  }

  const [p0, p1] = segment;
  const midPoint = {
    x: (p0.x + p1.x) / 2,
    y: (p0.y + p1.y) / 2,
  };

  const t = (x - p0.x) / (p1.x - p0.x);

  return evaluateQuadraticBezier(t, p0, midPoint, p1).y;
};

const useContainerWidth = (
  initialWidth: number,
  maxWidth: number,
): [React.RefObject<HTMLDivElement>, number] => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [containerWidth, setContainerWidth] = useState(initialWidth);

  useEffect(() => {
    const updateWidth = () => {
      if (!containerRef.current) {
        return;
      }
      const autoWidth = containerRef.current.offsetWidth;
      setContainerWidth(autoWidth > maxWidth ? maxWidth : autoWidth);
    };

    updateWidth();
    window.addEventListener('resize', updateWidth);
    return () => window.removeEventListener('resize', updateWidth);
  }, [maxWidth]);

  return [containerRef, containerWidth];
};

type Props = {
  weatherConditions: DetailedWeather[];
  onMouseChange?: (condition: DetailedWeather | null) => void;
};

export const TemperatureChart = ({
  weatherConditions,
  onMouseChange,
}: Props) => {
  const [mouseX, setMouseX] = useState<number | null>(null);
  const [containerRef, containerWidth] = useContainerWidth(500, 500);
  const { currentTheme } = useUserThemeContext();

  const temperatures = weatherConditions.map(({ temperature }) => temperature);
  const chartWidth = containerWidth - 34;
  const height = 80;
  const usedHeightPercentage = 0.6;
  const fontHeight = 12;

  const minTemp = Math.min(...temperatures);
  const maxTemp = Math.max(...temperatures);
  const deltaTemp = maxTemp - minTemp;

  const xScale = chartWidth / (weatherConditions.length - 1);
  const yScale = (height * usedHeightPercentage) / deltaTemp;
  const yOffset = height * ((1 - usedHeightPercentage) / 2);

  const points: Point[] = temperatures.map((temp, i) => ({
    x: i * xScale,
    y: height - (temp - Math.min(...temperatures)) * yScale - yOffset,
  }));

  const linePath = generateSmoothPath(points);
  const fillPath = `${linePath} L ${points[points.length - 1].x} ${height} L ${points[0].x} ${height} Z`;

  const handleMouseLeave = () => {
    setMouseX(null);
    onMouseChange?.(null);
  };

  const handleMouseMove = (x: number) => {
    if (x > chartWidth) {
      handleMouseLeave();
      return;
    }
    setMouseX(x);
    const weather = weatherConditions[Math.round(x / xScale)];
    onMouseChange?.(weather);
  };

  return (
    <div ref={containerRef} style={{ width: '100%', maxWidth: '500px' }}>
      <svg
        width={containerWidth}
        height={height + fontHeight}
        onMouseMove={(e) =>
          handleMouseMove(
            e.clientX - e.currentTarget.getBoundingClientRect().left,
          )
        }
        onTouchMove={(e) =>
          handleMouseMove(
            e.touches[0].clientX - e.currentTarget.getBoundingClientRect().left,
          )
        }
        onMouseLeave={handleMouseLeave}
        onTouchEnd={handleMouseLeave}
      >
        <CoordinateSystem
          weatherConditions={weatherConditions}
          chartWidth={chartWidth}
          usedHeightPercentage={usedHeightPercentage}
          height={height}
          fontHeight={fontHeight}
        />

        <path d={fillPath} fill={FILL_COLOR} />
        <path d={linePath} fill="none" stroke={STROKE_COLOR} strokeWidth={2} />

        {mouseX !== null && (
          <>
            <circle
              cx={mouseX}
              cy={getBezierHeightForX(points, mouseX)}
              r="5"
              fill={currentTheme === 'dark' ? 'white' : 'black'}
            />
            <line
              x1={mouseX}
              y1="0"
              x2={mouseX}
              y2={height}
              stroke={currentTheme === 'dark' ? 'white' : 'black'}
              strokeWidth="2"
            />
          </>
        )}
      </svg>
    </div>
  );
};
