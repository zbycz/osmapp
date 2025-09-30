import { format } from 'date-fns';
import React from 'react';
import { TableCell, TableRow } from '@mui/material';
import { DEFAULT_DATA_FORMAT } from '../../../config.mjs';
import { ClimbingTick } from '../../../types';
import { TickStyle } from './types';
import { TickStyleBadge } from '../../../services/my-ticks/TickStyleBadge';
import { TickMoreButton } from './TickMoreButton';

type TickRowProps = {
  tick: ClimbingTick;
};

export const RouteTickRow = ({ tick }: TickRowProps) => {
  const formattedDate = tick.timestamp
    ? format(tick.timestamp, DEFAULT_DATA_FORMAT)
    : tick.id;

  return (
    <TableRow>
      <TableCell>
        <TickStyleBadge style={tick.style as TickStyle} />
      </TableCell>
      <TableCell>{formattedDate}</TableCell>
      <TableCell sx={{ textAlign: 'right' }}>
        <TickMoreButton tick={tick} />
      </TableCell>
    </TableRow>
  );
};
