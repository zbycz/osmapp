import styled from '@emotion/styled';
import { DirectionsAutocomplete } from './DirectionsAutocomplete';
import React from 'react';
import {
  TextField,
  Button,
  Card,
  CardContent,
  ToggleButtonGroup,
  ToggleButton,
  IconButton,
  toggleButtonGroupClasses,
  InputAdornment,
  Paper,
  Stack,
} from '@mui/material';
import DirectionsWalkIcon from '@mui/icons-material/DirectionsWalk';
import DirectionsBikeIcon from '@mui/icons-material/DirectionsBike';
import DirectionsCarIcon from '@mui/icons-material/DirectionsCar';
import PlaceIcon from '@mui/icons-material/Place';
import CloseIcon from '@mui/icons-material/Close';
import SearchIcon from '@mui/icons-material/Search';
import { convertHexToRgba } from '../../utils/colorUtils';

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

const StyledPaper = styled(Paper)`
  position: absolute;
  top: 8px;
  left: 8px;
  z-index: 10;
  padding: ${({ theme }) => theme.spacing(2)};
  width: 340px;
  backdrop-filter: blur(10px);
  background: ${({ theme }) =>
    convertHexToRgba(theme.palette.background.paper, 0.9)};
`;

type Props = {
  toggleDirections: () => void;
};

// generated by https://v0.dev/chat/3MwraSQEqCc

export const DirectionsBox = ({ toggleDirections }: Props) => {
  const [transportMode, setTransportMode] = React.useState<string>('car');

  const handleTransportModeChange = (
    event: React.MouseEvent<HTMLElement>,
    newMode: string | null,
  ) => {
    if (newMode !== null) {
      setTransportMode(newMode);
    }
  };

  return (
    <StyledPaper elevation={3}>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: 16,
        }}
      >
        <StyledToggleButtonGroup
          value={transportMode}
          exclusive
          onChange={handleTransportModeChange}
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
        <IconButton onClick={toggleDirections} size="small" aria-label="close">
          <CloseIcon fontSize="small" />
        </IconButton>
      </div>

      <Stack spacing={1} mb={3}>
        <DirectionsAutocomplete label="Starting point" />
        <DirectionsAutocomplete label="Destination" />
      </Stack>

      <Button variant="contained" fullWidth startIcon={<SearchIcon />}>
        Get Directions
      </Button>
    </StyledPaper>
  );
};
