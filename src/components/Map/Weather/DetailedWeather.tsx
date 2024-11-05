import { useQuery } from 'react-query';
import {
  DetailedWeather as DetailedWeatherType,
  loadDetailedWeather,
} from './loadWeather';
import { DotLoader } from '../../helpers';
import React from 'react';
import { TemperatureChart } from './TemperatureChart';
import { intl } from '../../../services/intl';
import { Temperature } from './helpers';

const DetailedWeatherDisplay = ({
  response,
}: {
  response: Awaited<ReturnType<typeof loadDetailedWeather>>;
}) => {
  const entries = Object.entries(response);
  const [focusedWeekday, setFocusedWeekday] = React.useState(entries[0][0]);
  const [focusedWeather, setFocusedWeather] =
    React.useState<DetailedWeatherType | null>(null);

  return (
    <>
      <div style={{ display: 'flex', marginBottom: '1rem' }}>
        {entries.map(([weekdayIndex, data]) => {
          const temps = data.map(({ temperature }) => temperature);
          const maxTemp = Math.max(...temps);
          const minTemp = Math.min(...temps);
          return (
            <span
              key={weekdayIndex}
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                width: '100%',
              }}
            >
              <span>
                <Temperature celsius={maxTemp} precision={1} />
              </span>
              <span>
                <Temperature celsius={minTemp} precision={1} />
              </span>
            </span>
          );
        })}
      </div>
      <div style={{ display: 'flex', flexDirection: 'column' }}>
        {focusedWeather
          ? focusedWeather.time.toLocaleTimeString(intl.lang, {
              hour: 'numeric',
              minute: 'numeric',
            })
          : 'Daily Weather'}
        <TemperatureChart
          weatherConditions={response[focusedWeekday]}
          onMouseChange={setFocusedWeather}
        />
      </div>
    </>
  );
};

type Props = { lat: number; lng: number };

export const DetailedWeather = ({ lat, lng }: Props) => {
  const { data, status, error } = useQuery(['detailed-weather', lat, lng], () =>
    loadDetailedWeather({ lat, lon: lng }),
  );

  switch (status) {
    case 'success':
      return (
        <div>
          <DetailedWeatherDisplay response={data} />
        </div>
      );
    case 'idle':
    case 'loading':
      return (
        <div>
          {/* TODO: Replace with a real loading skeleton */}
          <DotLoader />
        </div>
      );
    case 'error':
      return (
        <div>{error instanceof Error ? error.message : 'An error occured'}</div>
      );
  }
};
