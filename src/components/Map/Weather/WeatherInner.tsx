import styled from '@emotion/styled';
import { WeatherResponse } from './loadWeather';
import { icons } from './icons';
import { Stack, Tooltip } from '@mui/material';
import { isImperial } from '../../helpers';
import { celsiusToFahrenheit, CenteredText, useClickOutside } from './helpers';
import React from 'react';

const StyledImg = styled.img`
  max-width: 35px;
  max-height: 35px;
`;

const TooltipContent = ({ content }: { content: string }) => (
  <>
    <CenteredText>{content}</CenteredText>
    <a href="https://open-meteo.com/">Weather data by Open-Meteo.com</a>
    <br />
    <a href="https://openweathermap.org/weather-conditions">
      Weather icons by OpenWeather
    </a>
  </>
);

type Props = {
  response: WeatherResponse['current'];
};

type TooltipState = 'closed' | 'hovered' | 'clicked';

const useTooltipState = () => {
  const tooltipRef = React.useRef<HTMLDivElement>(null);
  const [tooltipState, setTooltipState] =
    React.useState<TooltipState>('closed');

  useClickOutside(tooltipRef, () => {
    setTooltipState('closed');
  });

  React.useEffect(() => {
    const currentRef = tooltipRef.current;
    if (!currentRef) {
      return;
    }

    const handleMouseEnter = () => {
      setTooltipState((prev) => (prev === 'clicked' ? 'clicked' : 'hovered'));
    };

    const handleMouseLeave = () => {
      setTooltipState((prev) => (prev === 'clicked' ? 'clicked' : 'closed'));
    };

    const handleClick = () => {
      setTooltipState((prev) => (prev === 'clicked' ? 'closed' : 'clicked'));
    };

    currentRef.addEventListener('mouseenter', handleMouseEnter);
    currentRef.addEventListener('mouseleave', handleMouseLeave);
    currentRef.addEventListener('click', handleClick);

    return () => {
      currentRef.removeEventListener('mouseenter', handleMouseEnter);
      currentRef.removeEventListener('mouseleave', handleMouseLeave);
      currentRef.removeEventListener('click', handleClick);
    };
  }, [tooltipRef]);

  return {
    tooltipState,
    tooltipRef,
  };
};

export const WeatherInner = ({ response }: Props) => {
  const { tooltipState, tooltipRef } = useTooltipState();

  const isDay = response.is_day === 1;
  const icon = icons[response.weather_code];
  const iconDescription =
    icon.description ?? icon[response.is_day ? 'day' : 'night'].description;
  const temperature = isImperial()
    ? celsiusToFahrenheit(response.temperature_2m)
    : response.temperature_2m;

  return (
    <Tooltip
      arrow
      open={tooltipState === 'hovered' || tooltipState === 'clicked'}
      title={<TooltipContent content={iconDescription} />}
      placement="top"
      ref={tooltipRef}
    >
      <Stack alignItems="center">
        <StyledImg
          src={icon[isDay ? 'day' : 'night'].image}
          alt={iconDescription}
        />
        {Math.round(temperature)} {isImperial() ? '°F' : '°C'}
      </Stack>
    </Tooltip>
  );
};
