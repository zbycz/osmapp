import { fetchJson } from '../../../services/fetch';

export type WeatherResponse = {
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

export const loadWeather = ({ lat, lon }: Props) => {
  const currentFields = ['temperature_2m', 'weather_code', 'is_day'];
  const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=${currentFields.join(',')}`;
  return fetchJson<WeatherResponse>(url);
};
