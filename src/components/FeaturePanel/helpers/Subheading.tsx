import { Typography } from '@mui/material';
import React from 'react';

export const Subheading = ({ children }) => (
  <Typography variant="overline" display="block" color="textSecondary">
    {children}
  </Typography>
);
