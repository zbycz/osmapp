import { Typography } from '@material-ui/core';
import React from 'react';

export const Subheading = ({ children }) => (
  <Typography variant="overline" display="block" color="textSecondary">
    {children}
  </Typography>
);
