import { format } from 'date-fns';
import React from 'react';
import { TableCell, TableRow } from '@mui/material';
import { DEFAULT_DATA_FORMAT } from '../../../config.mjs';
import { Tick } from './types';
import { TickStyleBadge } from '../../../services/my-ticks/TickStyleBadge';
import { TickMoreButton } from './TickMoreButton';

type TickRowProps = {
  tick: Tick;
};

export const RouteTickRow = ({ tick }: TickRowProps) => {
  const formattedDate = tick.date ? format(tick.date, DEFAULT_DATA_FORMAT) : '';

  return (
    <>
      <TableRow>
        <TableCell>
          <TickStyleBadge style={tick.style} />
        </TableCell>
        <TableCell>{formattedDate}</TableCell>
        <TableCell sx={{ textAlign: 'right' }}>
          <TickMoreButton tick={tick} />
        </TableCell>
      </TableRow>
    </>
  );
};
