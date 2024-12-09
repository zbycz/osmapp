import { Stack, ToggleButton } from '@mui/material';
import DirectionsCarIcon from '@mui/icons-material/DirectionsCar';
import DirectionsBikeIcon from '@mui/icons-material/DirectionsBike';
import DirectionsWalkIcon from '@mui/icons-material/DirectionsWalk';
import React from 'react';
import styled from '@emotion/styled';
import { Profile } from './routing/types';

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
  value: Profile;
  setMode: (value: ((prevState: Profile) => Profile) | Profile) => void;
  onChange: (value: Profile) => void;
};

export const ModeToggler = ({ value, setMode, onChange }: Props) => {
  const handleChange = (_: unknown, newMode: Profile | null) => {
    if (newMode !== null) {
      setMode(newMode);
      onChange(newMode);
    }
  };

  return (
    <Stack direction="row" spacing={1}>
      {icons.map(([profile, Icon]) => (
        <StyledToggleButton
          key={profile}
          value={profile}
          onChange={handleChange}
          selected={value === profile}
        >
          <Icon />
        </StyledToggleButton>
      ))}
    </Stack>
  );
};
