import { useState } from 'react';
import styled from '@emotion/styled';
import { CurrentWeatherResponse } from './loadWeather';
import { icons } from './icons';
import {
  Stack,
  Dialog,
  DialogTitle,
  DialogContent,
  Typography,
} from '@mui/material';
import { Temperature } from './helpers';
import React from 'react';
import { DetailedWeather } from './DetailedWeather';
import { t } from '../../../services/intl';
import { ClosePanelButton } from '../../utils/ClosePanelButton';
import { useUserThemeContext } from '../../../helpers/theme';

const StyledImg = styled.img<{ $filter?: string }>`
  max-width: 30px;
  max-height: 30px;
  margin: -8px 0 -8px -8px;
  filter: ${({ $filter }) => $filter};
`;

type Props = {
  response: CurrentWeatherResponse['current'];
  lat: number;
  lng: number;
};

export const WeatherInner = ({ response, lat, lng }: Props) => {
  const { currentTheme } = useUserThemeContext();
  const [showWeatherDialog, setShowWeatherDialog] = useState(false);

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
        style={{ cursor: 'pointer' }}
      >
        <StyledImg
          src={icon[isDay ? 'day' : 'night'].image}
          alt={iconDescription}
          $filter={icon[isDay ? 'day' : 'night'].filter?.[currentTheme]}
        />
        <Temperature celsius={temperature} />
      </Stack>
      <Dialog
        open={showWeatherDialog}
        onClose={() => {
          setShowWeatherDialog(false);
        }}
      >
        <DialogTitle>{t('weather')}</DialogTitle>
        <ClosePanelButton
          right
          onClick={() => {
            setShowWeatherDialog(false);
          }}
        />
        <DialogContent>
          <DetailedWeather lng={lng} lat={lat} />
          <div style={{ textAlign: 'right' }}>
            <Typography variant="caption">
              <a href="https://open-meteo.com/">
                Weather data by Open-Meteo.com
              </a>{' '}
              ❤️
            </Typography>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};
