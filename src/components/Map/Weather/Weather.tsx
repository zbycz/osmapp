import { useQuery } from 'react-query';
import { useMapStateContext } from '../../utils/MapStateContext';
import styled from '@emotion/styled';
import { DotLoader } from '../../helpers';
import { convertHexToRgba } from '../../utils/colorUtils';
import { loadWeather } from './loadWeather';
import { WeatherInner } from './WeatherInner';
import { LonLat } from '../../../services/types';
import React from 'react';
import { getDistance } from '../../SearchBox/utils';

const WeatherWrapper = styled.div`
  color: ${({ theme }) => theme.palette.text.primary};
  background-color: ${({ theme }) =>
    convertHexToRgba(theme.palette.background.paper, 0.7)};
  backdrop-filter: blur(15px);
  padding: 0.5rem 1rem;
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
  const lastFetchedLocation = React.useRef<LonLat | null>(null);

  const { status, data, error } = useQuery(
    ['weather', lat, lon],
    () => loadWeather({ lat, lon }),
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
          <WeatherInner response={data.current} />
        </WeatherWrapper>
      );
    case 'error':
      return <WeatherWrapper>An error occured</WeatherWrapper>;
    case 'loading':
      return (
        <WeatherWrapper>
          <DotLoader />
        </WeatherWrapper>
      );
  }
};

export const Weather = () => {
  const { view } = useMapStateContext();
  const [zoom, lat, lon] = view;

  if (parseFloat(zoom) < 13) {
    return null;
  }

  return <WeatherLoader lat={parseFloat(lat)} lon={parseFloat(lon)} />;
};
