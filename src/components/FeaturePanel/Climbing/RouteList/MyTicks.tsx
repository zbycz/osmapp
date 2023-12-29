import React from 'react';
import styled from 'styled-components';
import DeleteIcon from '@mui/icons-material/Delete';
import { format } from 'date-fns';
import { FormControl, Select, MenuItem, Button } from '@mui/material';
import {
  findTicks,
  onTickDelete,
  onTickUpdate,
  tickStyles,
} from '../../../../services/ticks';
import { PanelLabel } from '../PanelLabel';

const Container = styled.div`
  margin-bottom: 20px;
`;
const Item = styled.div`
  font-size: 12px;
  display: flex;
  gap: 8px;
  align-items: center;
`;
const Date = styled.div``;

export const MyTicks = ({ osmId }) => {
  const ticks = findTicks(osmId);
  if (ticks.length === 0) return null;

  const deleteTick = (index) => {
    onTickDelete({ osmId, index });
  };

  const onTickStyleChange = (event, index) => {
    // @TODO tickId vs osmId
    onTickUpdate({
      osmId,
      index,
      updatedObject: { style: event.target.value },
    });
  };

  return (
    <Container>
      <PanelLabel>Ticks:</PanelLabel>
      {ticks.map((tick, index) => {
        const date = format(tick.date, 'd.M.yy');
        return (
          <Item>
            <Date>{date}</Date>

            <FormControl size="small">
              <Select
                labelId="demo-simple-select-label"
                value={tick.style}
                label="Type"
                onChange={(e) => onTickStyleChange(e, index)}
              >
                {tickStyles.map((tickStyle) => (
                  <MenuItem value={tickStyle.key}>{tickStyle.name}</MenuItem>
                ))}
              </Select>
            </FormControl>

            <Button
              size="small"
              onClick={() => deleteTick(index)}
              startIcon={<DeleteIcon />}
            />
          </Item>
        );
      })}
    </Container>
  );
};
