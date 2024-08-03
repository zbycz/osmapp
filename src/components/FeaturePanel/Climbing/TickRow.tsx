import { format } from 'date-fns';
import React from 'react';
import {
  FormControl,
  IconButton,
  MenuItem,
  Select,
  TableCell,
  TableRow,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import {
  getTickKey,
  onTickDelete,
  onTickUpdate,
  tickStyles,
} from '../../../services/ticks';
import { DEFAULT_DATA_FORMAT } from '../../../config';
import { Tick } from './types';

type TickRowProps = {
  tick: Tick;
};

export const TickRow = ({ tick }: TickRowProps) => {
  const deleteTick = (key) => {
    onTickDelete(key);
  };

  const onTickStyleChange = (event, key) => {
    onTickUpdate({
      tickKey: key,
      updatedObject: { style: event.target.value },
    });
  };

  const formattedDate = tick.date ? format(tick.date, DEFAULT_DATA_FORMAT) : '';
  const tickKey = getTickKey(tick);

  return (
    <TableRow>
      <TableCell>
        <FormControl size="small">
          <Select
            value={tick.style}
            size="small"
            variant="standard"
            onChange={(e) => onTickStyleChange(e, tickKey)}
          >
            {tickStyles.map((tickStyle) => (
              <MenuItem value={tickStyle.key}>{tickStyle.name}</MenuItem>
            ))}
          </Select>
        </FormControl>
      </TableCell>
      <TableCell>{formattedDate}</TableCell>
      <TableCell>
        <IconButton size="small" onClick={() => deleteTick(tickKey)}>
          <DeleteIcon />
        </IconButton>
      </TableCell>
    </TableRow>
  );
};
