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
  onTickDelete,
  onTickUpdate,
  tickStyles,
} from '../../../services/ticks';
import { DEFAULT_DATA_FORMAT } from '../../../config';
import { RouteDifficultyBadge } from './RouteDifficultyBadge';
import { Tick } from './types';
import { GradeSystem } from './utils/grades/gradeData';

type TickRowProps = {
  grade?: GradeSystem;
  gradeSystem?: string;
  tick: Tick;
  index: number;
};

export const TickRow = ({ grade, gradeSystem, tick, index }: TickRowProps) => {
  const deleteTick = (deteledIndex) => {
    onTickDelete({ osmId: tick.osmId, index: deteledIndex });
  };

  const onTickStyleChange = (event, changedIndex) => {
    onTickUpdate({
      osmId: tick.osmId,
      index: changedIndex,
      updatedObject: { style: event.target.value },
    });
  };

  const formattedDate = tick.date ? format(tick.date, DEFAULT_DATA_FORMAT) : '';

  const routeDifficulty = {
    grade,
    gradeSystem,
  };

  return (
    <TableRow>
      {grade && gradeSystem && (
        <TableCell>
          <RouteDifficultyBadge routeDifficulty={routeDifficulty} />
        </TableCell>
      )}
      <TableCell>
        <FormControl size="small">
          <Select
            value={tick.style}
            size="small"
            variant="standard"
            onChange={(e) => onTickStyleChange(e, index)}
          >
            {tickStyles.map((tickStyle) => (
              <MenuItem value={tickStyle.key}>{tickStyle.name}</MenuItem>
            ))}
          </Select>
        </FormControl>
      </TableCell>
      <TableCell>{formattedDate}</TableCell>
      <TableCell>
        <IconButton size="small" onClick={() => deleteTick(index)}>
          <DeleteIcon />
        </IconButton>
      </TableCell>
    </TableRow>
  );
};
