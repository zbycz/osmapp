import { useRef } from 'react';
import { useQuery } from 'react-query';
import { useMapStateContext } from '../../utils/MapStateContext';
import styled from '@emotion/styled';
import { convertHexToRgba } from '../../utils/colorUtils';
import { loadCurrentWeather } from './loadWeather';
import { WeatherInner } from './WeatherInner';
import { LonLat } from '../../../services/types';
import React from 'react';
import { getDistance } from '../../SearchBox/utils';
import { useUserSettingsContext } from '../../utils/userSettings/UserSettingsContext';

const WeatherWrapper = styled.div`
  color: ${({ theme }) => theme.palette.text.primary};
  background-color: ${({ theme }) =>
    convertHexToRgba(theme.palette.background.paper, 0.5)};
  backdrop-filter: blur(15px);
  -webkit-backdrop-filter: blur(15px);
  padding: 0.25rem 0.5rem;
  width: fit-content;
  border-radius: 8px;
  font-size: 0.85rem;
  pointer-events: all;
`;

type WeatherProps = {
  lat: number;
  lon: number;
};

const useLoadWeather = ({ lat, lon }: WeatherProps) => {
  const lastFetchedLocation = useRef<LonLat | null>(null);

  const { status, data, error } = useQuery(
    ['weather', lat, lon],
    () => loadCurrentWeather({ lat, lon }),
    {
      enabled:
        lastFetchedLocation.current === null ||
        getDistance(lastFetchedLocation.current, [lon, lat]) > 5_000,
      onSuccess: () => {
        lastFetchedLocation.current = [lon, lat];
      },
      keepPreviousData: true,
    },
  );

  return { status, data, error };
};

export const WeatherLoader = (props: WeatherProps) => {
  const { status, data } = useLoadWeather(props);

  switch (status) {
    case 'success':
    case 'idle':
      return (
        <WeatherWrapper>
          <WeatherInner
            response={data.current}
            lng={props.lon}
            lat={props.lat}
          />
        </WeatherWrapper>
      );
    case 'error':
    case 'loading':
      return null;
  }
};

export const Weather = () => {
  const { view } = useMapStateContext();
  const { userSettings } = useUserSettingsContext();
  const [zoom, lat, lon] = view;

  if (!userSettings['weather.enabled']) {
    return null;
  }
  if (parseFloat(zoom) < 13) {
    return null;
  }

  return <WeatherLoader lat={parseFloat(lat)} lon={parseFloat(lon)} />;
};
