import React from 'react';
import styled from 'styled-components';
import DeleteIcon from '@material-ui/icons/Delete';
import { Button } from '@material-ui/core';
import { findTicks, onTickDelete } from '../../../../services/ticks';
import { PanelLabel } from '../PanelLabel';

const Container = styled.div`
  margin-bottom: 20px;
`;
const Item = styled.div`
  font-size: 12px;
`;

export const MyTicks = ({ osmId }) => {
  const ticks = findTicks(osmId);
  if (ticks.length === 0) return null;

  const deleteAscent = (index) => {
    onTickDelete({ osmId, index });
  };

  return (
    <Container>
      <PanelLabel>Ticks:</PanelLabel>
      {ticks.map((ascent, index) => (
        <Item>
          {ascent.date}
          <Button
            size="small"
            onClick={() => deleteAscent(index)}
            startIcon={<DeleteIcon />}
          />
        </Item>
      ))}
    </Container>
  );
};
