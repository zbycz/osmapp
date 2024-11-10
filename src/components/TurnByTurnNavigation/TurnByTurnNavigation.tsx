import styled from '@emotion/styled';
import { toHumanDistance } from '../Directions/helpers';
import { icon } from '../Directions/routing/instructions';
import { useTurnByTurnContext } from '../utils/TurnByTurnContext';
import { useUserSettingsContext } from '../utils/UserSettingsContext';
import { calcDistance } from './helpers';
import { Stack } from '@mui/material';

const StyledTopPanel = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  z-index: 4;

  width: 100%;
  height: 160px;
  padding: 0.25rem 0.5rem;

  color: white;
  background: rgba(0, 0, 0, 0.8);
  backdrop-filter: blur(32px);

  display: flex;
  align-items: center;
  gap: 0.5rem;

  svg {
    font-size: 7rem;
  }

  span {
    white-space: nowrap;
    font-weight: bold;
    font-size: 2.25rem;
  }

  p {
    margin: 0;
  }
`;

const Distance = ({ distance }: { distance: number }) => {
  const { userSettings } = useUserSettingsContext();
  const { isImperial } = userSettings;

  return <span>{toHumanDistance(isImperial, distance)}</span>;
};

export const TurnByTurnNavigation = () => {
  const { instructions } = useTurnByTurnContext();
  const currentInstruction = instructions[0];
  const nextInstruction = instructions[1] || currentInstruction;

  const Icon = icon(nextInstruction.sign);

  return (
    <StyledTopPanel>
      <Icon />
      <Stack>
        <Distance distance={calcDistance(currentInstruction.path)} />
        <p>{nextInstruction.text}</p>
      </Stack>
    </StyledTopPanel>
  );
};
