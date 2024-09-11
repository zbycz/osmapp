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

const StyledToggleButtonGroup = styled(ToggleButtonGroup)(({ theme }) => ({
  [`& .${toggleButtonGroupClasses.grouped}`]: {
    margin: theme.spacing(0.5),
    marginRight: 10,
    border: 0,
    borderRadius: theme.shape.borderRadius,
    [`&.${toggleButtonGroupClasses.disabled}`]: {
      border: 0,
    },
  },
  [`& .${toggleButtonGroupClasses.middleButton},& .${toggleButtonGroupClasses.lastButton}`]:
    {
      marginLeft: -1,
      borderLeft: '1px solid transparent',
    },
  button: {
    margin: 6,
  },
  svg: {
    fontSize: '18px',
  },
}));

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
    <StyledToggleButtonGroup
      value={value}
      exclusive
      onChange={onChange}
      aria-label="transport mode"
      size="small"
    >
      <ToggleButton value="car" aria-label="car">
        <DirectionsCarIcon />
      </ToggleButton>
      <ToggleButton value="bike" aria-label="bike">
        <DirectionsBikeIcon />
      </ToggleButton>
      <ToggleButton value="walk" aria-label="walk">
        <DirectionsWalkIcon />
      </ToggleButton>
    </StyledToggleButtonGroup>
  );
};
