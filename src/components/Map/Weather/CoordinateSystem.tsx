import { intl } from '../../../services/intl';
import { sampleEvenly, Temperature } from './helpers';
import { DetailedWeather } from './loadWeather';

type Props = {
  weatherConditions: DetailedWeather[];
  chartWidth: number;
  usedHeightPercentage: number;
  height: number;
  fontHeight: number;
};

export const CoordinateSystem = ({
  weatherConditions,
  chartWidth,
  usedHeightPercentage,
  height,
  fontHeight,
}: Props) => {
  const verticalBars = 4;
  const horizontalBars = 5;

  const temperatures = weatherConditions.map(({ temperature }) => temperature);
  const maxTemp = Math.max(...temperatures);
  const deltaTemp = maxTemp - Math.min(...temperatures);

  const verticalPadding = height * (1 - usedHeightPercentage) * 0.5;
  const temperatureHeight = height * usedHeightPercentage;
  const tempPerPixel = deltaTemp / temperatureHeight;

  return (
    <>
      {sampleEvenly(weatherConditions, verticalBars).map(({ time }, i) => (
        <>
          <line
            key={time.getTime()}
            x1={i * (chartWidth / verticalBars)}
            x2={i * (chartWidth / verticalBars)}
            y1="0"
            y2={height + fontHeight}
            stroke="rgba(163, 163, 163, 0.25)"
            strokeWidth="1"
          />
          <text
            x={i * (chartWidth / verticalBars) + 4}
            y={height + fontHeight}
            fontSize={fontHeight}
            fill="rgb(163, 163, 163)"
          >
            {time.toLocaleTimeString(intl.lang, {
              hour: 'numeric',
              minute: 'numeric',
            })}
          </text>
        </>
      ))}
      {Array.from(
        { length: horizontalBars },
        (_, i) => (i + 1) * (height / (horizontalBars + 1)),
      ).map((y) => (
        <>
          <line
            key={y}
            x1="0"
            y1={y}
            x2={chartWidth}
            y2={y}
            stroke="rgba(163, 163, 163, 0.25)"
            strokeWidth="1"
          />
          <text
            x={chartWidth + 4}
            y={y + fontHeight / 2}
            fontSize={fontHeight}
            fill="rgb(163, 163, 163)"
          >
            <Temperature
              celsius={maxTemp - tempPerPixel * (y - verticalPadding)}
            />
          </text>
        </>
      ))}
    </>
  );
};
