import {
  ToggleButton,
  ToggleButtonGroup,
  toggleButtonGroupClasses,
} from '@mui/material';
import DirectionsCarIcon from '@mui/icons-material/DirectionsCar';
import DirectionsBikeIcon from '@mui/icons-material/DirectionsBike';
import DirectionsWalkIcon from '@mui/icons-material/DirectionsWalk';
import React from 'react';
import styled from '@emotion/styled';

import { brouterProfiles } from './routing/getBrouterResults';

const StyledToggleButton = styled(ToggleButton)`
  padding: 8px;
  border: 0;

  svg {
    font-size: 20px;
  }
`;

const icons = [
  ['car', DirectionsCarIcon],
  ['bike', DirectionsBikeIcon],
  ['walk', DirectionsWalkIcon],
] as const;

type Props = {
  value: string;
  setMode: (value: ((prevState: string) => string) | string) => void;
};

export const ModeToggler = ({ value, setMode }: Props) => {
  const onChange = (_, newMode) => {
    if (newMode !== null) {
      setMode(newMode);
    }
  };

  return (
    <>
      {icons.map(([profile, Icon]) => (
        <StyledToggleButton
          key={profile}
          value={profile}
          onChange={onChange}
          selected={value === profile}
        >
          <Icon />
        </StyledToggleButton>
      ))}
    </>
  );
};
