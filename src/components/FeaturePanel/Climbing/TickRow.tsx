import { format } from 'date-fns';
import React from 'react';
import { FormControl, IconButton, TableCell, TableRow } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import {
  getTickKey,
  onTickDelete,
  onTickUpdate,
} from '../../../services/ticks';
import { DEFAULT_DATA_FORMAT } from '../../../config.mjs';
import { Tick } from './types';
import { TickStyleSelect } from './Ticks/TickStyleSelect';
import { useSnackbar } from '../../utils/SnackbarContext';

type TickRowProps = {
  tick: Tick;
};

export const TickRow = ({ tick }: TickRowProps) => {
  const tickKey = getTickKey(tick);
  const showSnackbar = useSnackbar();
  const deleteTick = (key) => {
    onTickDelete(key);
  };

  const onTickStyleChange = (event, key) => {
    onTickUpdate({
      tickKey: key,
      updatedObject: { style: event.target.value },
    });
  };

  const handleTickDelete = () => {
    deleteTick(tickKey);
    showSnackbar('Tick was deleted', 'success');
  };
  const formattedDate = tick.date ? format(tick.date, DEFAULT_DATA_FORMAT) : '';

  return (
    <TableRow>
      <TableCell>
        <FormControl size="small">
          <TickStyleSelect
            value={tick.style}
            onChange={(e) => onTickStyleChange(e, tickKey)}
          />
        </FormControl>
      </TableCell>
      <TableCell>{formattedDate}</TableCell>
      <TableCell>
        <IconButton size="small" onClick={handleTickDelete}>
          <DeleteIcon />
        </IconButton>
      </TableCell>
    </TableRow>
  );
};
