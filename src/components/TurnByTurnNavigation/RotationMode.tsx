import styled from '@emotion/styled';
import Explore from '@mui/icons-material/Explore';
import ExploreOff from '@mui/icons-material/ExploreOff';
import { ButtonBase } from '@mui/material';
import { convertHexToRgba } from '../utils/colorUtils';
import { useTurnByTurnContext } from '../utils/TurnByTurnContext';

const StyledButton = styled(ButtonBase)`
  border-radius: 100%;
  color: ${({ theme }) => theme.palette.text.primary};
  background-color: ${({ theme }) =>
    convertHexToRgba(theme.palette.background.paper, 0.5)};
  backdrop-filter: blur(15px);
  padding: 6px;

  svg {
    font-size: 2.25rem;
  }
`;

export const SwitchRotationMode = () => {
  const { rotationMode, setRotationMode } = useTurnByTurnContext();

  const Icon = rotationMode === 'user' ? ExploreOff : Explore;
  return (
    <StyledButton
      onClick={() => {
        setRotationMode((prev) => (prev === 'user' ? 'route' : 'user'));
      }}
    >
      <Icon />
    </StyledButton>
  );
};
