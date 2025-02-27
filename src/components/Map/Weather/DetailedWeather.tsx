import { useQuery } from 'react-query';
import {
  DetailedWeather as DetailedWeatherType,
  loadDetailedWeather,
} from './loadWeather';
import { DotLoader } from '../../helpers';
import React, { useState } from 'react';
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
  const [weekDay, setWeekDay] = useState<string>(entries[0][0]);
  const [focusedTimeslot, setFocusedTimeslot] =
    useState<DetailedWeatherType | null>(null);

  return (
    <Stack spacing={1}>
      <DaySelector data={response} current={weekDay} onSelect={setWeekDay} />
      <FocusedWeather
        dayWeather={response[weekDay]}
        weather={focusedTimeslot}
      />
      <TemperatureChart
        weatherConditions={response[weekDay]}
        onMouseChange={setFocusedTimeslot}
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
