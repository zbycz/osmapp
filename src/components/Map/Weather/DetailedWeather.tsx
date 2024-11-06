import { useQuery } from 'react-query';
import {
  DetailedWeather as DetailedWeatherType,
  loadDetailedWeather,
} from './loadWeather';
import { DotLoader } from '../../helpers';
import React from 'react';
import { TemperatureChart } from './TemperatureChart';
import { DaySelector } from './DaySelector';
import { FocusedWeather } from './FocusedWeather';
import { Stack } from '@mui/material';

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
    <Stack spacing={1}>
      <DaySelector data={response} onSelect={setFocusedWeekday} />
      <FocusedWeather
        dayWeather={response[focusedWeekday]}
        weather={focusedWeather}
      />
      <TemperatureChart
        weatherConditions={response[focusedWeekday]}
        onMouseChange={setFocusedWeather}
      />
    </Stack>
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
