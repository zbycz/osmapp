import { fetchJson } from '../../../services/fetch';
import { format, addDays, startOfDay } from 'date-fns';
import { arrayValuesToObjectArray } from './helpers';
import groupBy from 'lodash/groupBy';

export type CurrentWeatherResponse = {
  latitude: number;
  longitude: number;
  generationtime_ms: number;
  utc_offset_seconds: number;
  timezone: string;
  timezone_abbreviation: string;
  elevation: number;
  current_units: {
    time: string;
    interval: string;
    temperature_2m: '°C';
    weather_code: 'wmo code';
    is_day: '';
  };
  current: {
    time: string;
    interval: number;
    temperature_2m: number;
    weather_code: number;
    is_day: 0 | 1;
  };
};

type Props = {
  lat: number;
  lon: number;
};

export const loadCurrentWeather = async ({ lat, lon }: Props) => {
  const fields = ['temperature_2m', 'weather_code', 'is_day'];
  const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=${fields.join(',')}`;
  return fetchJson<CurrentWeatherResponse>(url);
};

type FutureResponse = {
  hourly: {
    time: string[];
    temperature_2m: number[];
    weather_code: number[];
    is_day: (0 | 1)[];
    precipitation_probability: number[];
  };
};

export type DetailedWeather = Awaited<
  ReturnType<typeof loadDetailedWeather>
>[string][number];

export const loadDetailedWeather = async ({ lat, lon }: Props) => {
  const fields = [
    'temperature_2m',
    'weather_code',
    'is_day',
    'precipitation_probability',
  ];

  const today = startOfDay(new Date());
  const startDate = format(today, 'yyyy-MM-dd');
  const endDate = format(addDays(today, 3), 'yyyy-MM-dd');

  const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&start_date=${startDate}&end_date=${endDate}&hourly=${fields.join(',')}`;
  const { hourly } = await fetchJson<FutureResponse>(url);

  const transformed = arrayValuesToObjectArray(hourly).map(
    ({
      is_day,
      precipitation_probability,
      temperature_2m,
      weather_code,
      time,
    }) => ({
      isDay: is_day === 1,
      precipitationProbability: precipitation_probability,
      temperature: temperature_2m,
      weatherCode: weather_code,
      time: new Date(time),
    }),
  );
  return groupBy(
    transformed,
    ({ time }) => time.getDay() + (today.getDay() > time.getDay() ? 100 : 0), // if we are on Thursday (4) and get forecast for Sunday (0), we want it to show after Saturday (6),
  );
};
