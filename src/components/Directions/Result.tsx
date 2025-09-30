import { useState } from 'react';
import { useMobileMode } from '../helpers';
import { Button, Divider, Paper, Stack, Typography } from '@mui/material';
import React from 'react';
import styled from '@emotion/styled';
import { convertHexToRgba } from '../utils/colorUtils';
import { TooltipButton } from '../utils/TooltipButton';
import { RoutingResult } from './routing/types';
import { t, Translation } from '../../services/intl';
import { CloseButton, toHumanDistance } from './helpers';
import { useUserSettingsContext } from '../utils/userSettings/UserSettingsContext';
import { Instructions } from './Instructions';
import { useDirectionsContext } from './DirectionsContext';

export const StyledPaper = styled(Paper, {
  shouldForwardProp: (prop) => !prop.startsWith('$'),
})<{
  $height?: string;
  $overflow?: string;
}>`
  background-color: ${({ theme }) =>
    convertHexToRgba(theme.palette.background.paper, 0.8)};
  -webkit-backdrop-filter: blur(35px);
  backdrop-filter: blur(35px);
  padding: ${({ theme }) => theme.spacing(1.5)};
  height: ${({ $height }) => $height};
  overflow-y: ${({ $overflow }) => $overflow};
`;

export const StyledPaperMobile = styled(Paper)`
  backdrop-filter: blur(10px);
  background: ${({ theme }) =>
    convertHexToRgba(theme.palette.background.paper, 0.9)};
  padding: ${({ theme }) => theme.spacing(1)} ${({ theme }) => theme.spacing(2)}
    ${({ theme }) => theme.spacing(0.5)} ${({ theme }) => theme.spacing(2)};
  text-align: center;
  height: 100%;
  overflow-y: auto;
`;

const CloseContainer = styled.div`
  position: absolute;
  top: 0;
  right: 0;
`;

const toHumanTime = (seconds: number) => {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const minutesStr = minutes < 10 ? `0${minutes}` : minutes;
  return hours > 0 ? `${hours}:${minutesStr} h` : `${minutes} min`;
};

const PoweredBy = ({ result }: { result: RoutingResult }) => (
  <Typography variant="caption" component="div">
    <Translation
      id="directions.powered_by"
      values={{ link: `<a href=${result.link}>${result.router}</a>` }}
    />
  </Typography>
);

type Props = { revealForm: false | (() => void) };

const MobileResult = ({
  revealForm,
  time,
  distance,
  ascent,
}: Props & Record<'time' | 'distance' | 'ascent', string>) => {
  const [showInstructions, setShowInstructions] = useState(false);

  const { result } = useDirectionsContext();
  return (
    <StyledPaperMobile elevation={3}>
      <div>
        {revealForm && (
          <CloseContainer>
            <CloseButton />
          </CloseContainer>
        )}
        <strong>{distance}</strong> • <strong>{time}</strong> • ↑{ascent}
        <TooltipButton
          tooltip={<PoweredBy result={result} />}
          sx={{ color: 'secondary', fontSize: '16px' }}
        />
      </div>
      <Stack direction="row" justifyContent="space-between">
        {result.instructions && (
          <Button
            size="small"
            fullWidth
            onClick={() => {
              setShowInstructions((x) => !x);
            }}
          >
            {showInstructions ? 'Hide instructions' : 'Show instructions'}
          </Button>
        )}
        {revealForm && (
          <Button size="small" fullWidth onClick={revealForm}>
            {t('directions.edit_destinations')}
          </Button>
        )}
      </Stack>
      {showInstructions && <Instructions instructions={result.instructions} />}
    </StyledPaperMobile>
  );
};

export const Result = ({ revealForm }: Props) => {
  const isMobileMode = useMobileMode();
  const { userSettings } = useUserSettingsContext();
  const { isImperial } = userSettings;

  const { result } = useDirectionsContext();
  if (!result) return null;
  const time = toHumanTime(result.time);
  const distance = toHumanDistance(isImperial, result.distance);
  const ascent = toHumanDistance(isImperial, result.totalAscent);

  if (isMobileMode) {
    return (
      <MobileResult
        revealForm={revealForm}
        time={time}
        distance={distance}
        ascent={ascent}
      />
    );
  }

  return (
    <StyledPaper elevation={3} $height="100%" $overflow="auto">
      <Stack
        direction="row"
        spacing={2}
        width="100%"
        justifyContent="space-between"
      >
        <div>
          <Typography variant="caption">
            {t('directions.result.time')}
          </Typography>
          <Typography fontWeight={900} variant="h6">
            {time}
          </Typography>
        </div>
        <div>
          <Typography variant="caption">
            {t('directions.result.distance')}
          </Typography>
          <Typography fontWeight={900} variant="h6">
            {distance}
          </Typography>
        </div>
        <div>
          <Typography variant="caption">
            {t('directions.result.ascent')}
          </Typography>
          <Typography fontWeight={900} variant="h6">
            {ascent}
          </Typography>
        </div>
      </Stack>
      <Divider sx={{ mt: 2, mb: 3 }} />
      {result.instructions && (
        <Instructions instructions={result.instructions} />
      )}
      <PoweredBy result={result} />
    </StyledPaper>
  );
};
