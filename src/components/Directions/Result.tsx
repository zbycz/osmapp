import { useMobileMode } from '../helpers';
import { Button, Paper, Stack, Typography } from '@mui/material';
import React from 'react';
import styled from '@emotion/styled';
import { convertHexToRgba } from '../utils/colorUtils';
import { TooltipButton } from '../utils/TooltipButton';
import { RoutingResult } from './routing/types';
import { t, Translation } from '../../services/intl';
import { CloseButton, toHumanDistance } from './helpers';
import { useUserSettingsContext } from '../utils/UserSettingsContext';
import { Instructions } from './Instructions';

export const StyledPaper = styled(Paper)<{
  $height?: string;
  $overflow?: string;
}>`
  backdrop-filter: blur(10px);
  background: ${({ theme }) =>
    convertHexToRgba(theme.palette.background.paper, 0.9)};
  padding: ${({ theme }) => theme.spacing(2)};
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

type Props = { result: RoutingResult; revealForm: false | (() => void) };

const MobileResult = ({
  result,
  revealForm,
  time,
  distance,
  ascent,
}: Props & Record<'time' | 'distance' | 'ascent', string>) => {
  const [showInstructions, setShowInstructions] = React.useState(false);

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
          color="secondary"
        />
      </div>
      <Stack>
        {result.instructions && (
          <Button
            size="small"
            onClick={() => {
              setShowInstructions((x) => !x);
            }}
          >
            {showInstructions ? 'Hide' : 'Show'} instructions
          </Button>
        )}
        {revealForm && (
          <Button size="small" onClick={revealForm}>
            {t('directions.edit_destinations')}
          </Button>
        )}
      </Stack>
      {showInstructions && <Instructions instructions={result.instructions} />}
    </StyledPaperMobile>
  );
};

export const Result = ({ result, revealForm }: Props) => {
  const isMobileMode = useMobileMode();
  const { userSettings } = useUserSettingsContext();
  const { isImperial } = userSettings;

  const time = toHumanTime(result.time);
  const distance = toHumanDistance(isImperial, result.distance);
  const ascent = toHumanDistance(isImperial, result.totalAscent);

  if (isMobileMode) {
    return (
      <MobileResult
        result={result}
        revealForm={revealForm}
        time={time}
        distance={distance}
        ascent={ascent}
      />
    );
  }

  return (
    <StyledPaper elevation={3} $height="100%" $overflow="auto">
      {t('directions.result.time')}: <strong>{time}</strong>
      <br />
      {t('directions.result.distance')}: <strong>{distance}</strong>
      <br />
      {t('directions.result.ascent')}: <strong>{ascent}</strong>
      <br />
      <br />
      {result.instructions && (
        <Instructions instructions={result.instructions} />
      )}
      <PoweredBy result={result} />
    </StyledPaper>
  );
};
