import { isImperial, useMobileMode } from '../helpers';
import { Button, Paper, Typography } from '@mui/material';
import React from 'react';
import styled from '@emotion/styled';
import { convertHexToRgba } from '../utils/colorUtils';
import { TooltipButton } from '../utils/TooltipButton';
import { RoutingResult } from './routing/types';
import { t } from '../../services/intl';
import { CloseButton } from './helpers';

export const StyledPaper = styled(Paper)`
  backdrop-filter: blur(10px);
  background: ${({ theme }) =>
    convertHexToRgba(theme.palette.background.paper, 0.9)};
  padding: ${({ theme }) => theme.spacing(2)};
`;

export const StyledPaperMobile = styled(Paper)`
  backdrop-filter: blur(10px);
  background: ${({ theme }) =>
    convertHexToRgba(theme.palette.background.paper, 0.9)};
  padding: ${({ theme }) => theme.spacing(1)} ${({ theme }) => theme.spacing(2)}
    ${({ theme }) => theme.spacing(0.5)} ${({ theme }) => theme.spacing(2)};
  text-align: center;
`;

const CloseContainer = styled.div`
  position: absolute;
  top: 0;
  right: 0;
`;

const getHumanMetric = (meters) => {
  if (meters < 1000) {
    return `${meters} m`;
  }
  return `${(meters / 1000).toFixed(1)} km`;
};

const getHumanImperial = (meters) => {
  const miles = meters * 0.000621371192;
  if (miles < 1) {
    return `${Math.round(miles * 5280)} ft`;
  }
  return `${miles.toFixed(1)} mi`;
};

const toHumanDistance = (meters) =>
  isImperial() ? getHumanImperial(meters) : getHumanMetric(meters);

const toHumanTime = (seconds) => {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const minutesStr = minutes < 10 ? `0${minutes}` : minutes;
  return hours > 0 ? `${hours}:${minutesStr} h` : `${minutes} min`;
};

const PoweredBy = ({ result }: { result: RoutingResult }) => (
  <Typography variant="caption" component="div">
    Search powered by <a href={result.link}>{result.router}</a>.
  </Typography>
);

type Props = { result: RoutingResult; revealForm: false | (() => void) };

export const Result = ({ result, revealForm }: Props) => {
  const isMobileMode = useMobileMode();

  const time = toHumanTime(result.time);
  const distance = toHumanDistance(result.distance);
  const ascent = toHumanDistance(result.totalAscent);

  if (isMobileMode) {
    return (
      <StyledPaperMobile elevation={3}>
        {revealForm && (
          <CloseContainer>
            <CloseButton />
          </CloseContainer>
        )}
        <strong>{distance}</strong> • <strong>{time}</strong> • ↑{ascent}
        <TooltipButton
          tooltip={<PoweredBy result={result} />}
          color="secondary"
        />
        {revealForm && (
          <Button size="small" onClick={revealForm}>
            {t('directions.edit_destinations')}
          </Button>
        )}
      </StyledPaperMobile>
    );
  }

  return (
    <StyledPaper elevation={3}>
      Time: <strong>{time}</strong>
      <br />
      Distance: <strong>{distance}</strong>
      <br />
      Ascent: <strong>{ascent}</strong>
      <br />
      <br />
      <PoweredBy result={result} />
    </StyledPaper>
  );
};
