import styled from '@emotion/styled';
import { icon, Sign } from './routing/instructions';
import { RoutingResult } from './routing/types';
import { useUserSettingsContext } from '../utils/UserSettingsContext';
import { toHumanDistance } from './helpers';
import { Box, Divider, Grid2, Stack, Typography } from '@mui/material';
import { useTheme } from '@emotion/react';

type Instruction = RoutingResult['instructions'][number];

const Distance = ({ distance }: { distance: number }) => {
  const { userSettings } = useUserSettingsContext();
  const { isImperial } = userSettings;

  return <>{toHumanDistance(isImperial, distance)}</>;
};

const Icon = ({ sign }: { sign: Sign }) => {
  const Component = icon(sign);
  return <Component fontSize="large" />;
};

const StyledListItem = styled.li`
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
`;

const Instruction = ({ instruction }: { instruction: Instruction }) => {
  const theme = useTheme();

  return (
    <StyledListItem>
      <Stack direction="row" alignItems="center">
        <Box width={theme.spacing(6)}>
          <Icon sign={instruction.sign} />
        </Box>
        <Typography variant="subtitle1" fontWeight={700}>
          {instruction.street_name || instruction.text}
        </Typography>
      </Stack>
      {instruction.distance > 0 && (
        <Stack direction="row" alignItems="center" spacing={2} ml={6}>
          <Typography
            noWrap
            color="textSecondary"
            variant="body2"
            style={{ overflow: 'visible' }}
          >
            <Distance distance={instruction.distance} />
          </Typography>
          <Stack flex={1}>
            <Divider />
          </Stack>
        </Stack>
      )}
    </StyledListItem>
  );
};

const StyledList = styled.ul`
  list-style: none;
  padding: 0;

  max-height: 100%;

  display: flex;
  flex-direction: column;
  gap: 0.25rem;
`;

type Props = {
  instructions: Instruction[];
};

export const Instructions = ({ instructions }: Props) => (
  <StyledList>
    {instructions.map((instruction) => (
      <Instruction
        key={`${instruction.time}-${instruction.text}`}
        instruction={instruction}
      />
    ))}
  </StyledList>
);
