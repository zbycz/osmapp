import { IconButton } from '@mui/material';
import DirectionsIcon from '@mui/icons-material/Directions';
import React from 'react';
import Router from 'next/router';
import Link from 'next/link';

export const DirectionsButton = () => {
  return (
    <IconButton component={Link} href="/directions">
      <DirectionsIcon />
    </IconButton>
  );
};
