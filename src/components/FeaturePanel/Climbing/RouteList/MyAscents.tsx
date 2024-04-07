import React from 'react';
import styled from 'styled-components';
import DeleteIcon from '@material-ui/icons/Delete';
import { Button } from '@material-ui/core';
import { findAscents, onAscentDelete } from '../utils/ascents';
import { PanelLabel } from '../PanelLabel';

const Container = styled.div`
  margin-bottom: 20px;
`;
const Item = styled.div`
  font-size: 12px;
`;

export const MyAscents = ({ osmId }) => {
  const ascents = findAscents(osmId);
  if (ascents.length === 0) return null;

  const deleteAscent = (index) => {
    onAscentDelete({ osmId, index });
  };

  return (
    <Container>
      <PanelLabel>Ascents:</PanelLabel>
      {ascents.map((ascent, index) => (
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
