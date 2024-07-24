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
import Router from 'next/router';
import styled from 'styled-components';
import {
  onTickDelete,
  onTickUpdate,
  tickStyles,
} from '../../../services/ticks';
import { getApiId, getUrlOsmId } from '../../../services/helpers';
import { DEFAULT_DATA_FORMAT } from '../../../config';
import { RouteDifficultyBadge } from './RouteDifficultyBadge';
import { Tick } from './types';
import { GradeSystem } from './utils/grades/gradeData';

const Name = styled.a`
  flex: 1;
`;

type TickRowProps = {
  name?: string;
  grade?: GradeSystem;
  gradeSystem?: string;
  tick: Tick;
  index: number;
  isNameVisible?: boolean;
  isReadOnly?: boolean;
};

export const TickRow = ({
  name,
  grade,
  gradeSystem,
  tick,
  index,
  isNameVisible = false,
  isReadOnly = false,
}: TickRowProps) => {
  const apiId = getApiId(tick.osmId);
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

  const onNameClick = () => {
    Router.push(`/${getUrlOsmId(apiId)}`);
  };

  const formattedDate = tick.date ? format(tick.date, DEFAULT_DATA_FORMAT) : '';

  const routeDifficulty = {
    grade,
    gradeSystem,
  };

  return (
    <TableRow>
      {isNameVisible && (
        <TableCell>
          <Name onClick={onNameClick}>{name || tick.osmId}</Name>
        </TableCell>
      )}
      {grade && gradeSystem && (
        <TableCell>
          <RouteDifficultyBadge routeDifficulty={routeDifficulty} />
        </TableCell>
      )}
      <TableCell>
        <FormControl size="small">
          {isReadOnly ? (
            tick.style
          ) : (
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
          )}
        </FormControl>
      </TableCell>
      <TableCell>{formattedDate}</TableCell>
      {!isReadOnly && (
        <TableCell>
          <IconButton size="small" onClick={() => deleteTick(index)}>
            <DeleteIcon />
          </IconButton>
        </TableCell>
      )}
    </TableRow>
  );
};
