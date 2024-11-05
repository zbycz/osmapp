import styled from '@emotion/styled';
import { CurrentWeatherResponse } from './loadWeather';
import { icons } from './icons';
import { Stack, Dialog, DialogTitle, DialogContent } from '@mui/material';
import { Temperature } from './helpers';
import React from 'react';
import { DetailedWeather } from './DetailedWeather';

const StyledImg = styled.img`
  max-width: 30px;
  max-height: 30px;
  margin: -8px 0 -8px -8px;
`;

type Props = {
  response: CurrentWeatherResponse['current'];
  lat: number;
  lng: number;
};

export const WeatherInner = ({ response, lat, lng }: Props) => {
  const [showWeatherDialog, setShowWeatherDialog] = React.useState(false);

  const isDay = response.is_day === 1;
  const icon = icons[response.weather_code];
  const iconDescription =
    icon.description ?? icon[response.is_day ? 'day' : 'night'].description;
  const temperature = response.temperature_2m;

  return (
    <>
      <Stack
        alignItems="center"
        direction="row"
        onClick={() => {
          setShowWeatherDialog(true);
        }}
      >
        <StyledImg
          src={icon[isDay ? 'day' : 'night'].image}
          alt={iconDescription}
        />
        <Temperature celsius={temperature} />
      </Stack>
      <Dialog
        open={showWeatherDialog}
        onClose={() => {
          setShowWeatherDialog(false);
        }}
      >
        <DialogTitle>{iconDescription} Weather</DialogTitle>
        <DialogContent>
          <DetailedWeather lng={lng} lat={lat} />
          <a href="https://open-meteo.com/">Weather data by Open-Meteo.com</a>
        </DialogContent>
      </Dialog>
    </>
  );
};
