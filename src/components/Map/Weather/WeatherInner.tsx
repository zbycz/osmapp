import styled from '@emotion/styled';
import { WeatherResponse } from './loadWeather';
import { icons } from './icons';
import { Tooltip } from '@mui/material';
import { isImperial } from '../../helpers';
import { celsiusToFahrenheit } from './helpers';

const StyledImg = styled.img`
  max-width: 35px;
  max-height: 35px;
`;

type Props = {
  response: WeatherResponse['current'];
};

export const WeatherInner = ({ response }: Props) => {
  const isDay = response.is_day === 1;
  const icon = icons[response.weather_code];
  const iconDescription =
    icon.description ?? icon[response.is_day ? 'day' : 'night'].description;
  const temperature = isImperial()
    ? celsiusToFahrenheit(response.temperature_2m)
    : response.temperature_2m;

  return (
    <>
      <Tooltip arrow title={iconDescription} placement="top">
        <StyledImg
          src={icon[isDay ? 'day' : 'night'].image}
          alt={iconDescription}
        />
      </Tooltip>
      {Math.round(temperature)} {isImperial() ? '°F' : '°C'}
    </>
  );
};
