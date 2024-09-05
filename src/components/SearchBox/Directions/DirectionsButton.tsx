import { IconButton } from '@mui/material';
import DirectionsIcon from '@mui/icons-material/Directions';
import React from 'react';

type Props = {
  onClick: () => void;
};

export const DirectionsButton = ({ onClick }: Props) => (
  <IconButton onClick={onClick}>
    <DirectionsIcon />
  </IconButton>
);
