import React from 'react';
import styled from 'styled-components';
import { findTicks, getTickKey } from '../../../../services/ticks';
import { PanelLabel } from '../PanelLabel';
import { TickRow } from '../TickRow';

const Container = styled.div`
  margin-bottom: 20px;
`;

export const MyRouteTicks = ({ osmId }) => {
  const ticks = findTicks(osmId);
  if (ticks.length === 0) return null;

  return (
    <Container>
      <PanelLabel>Ticks:</PanelLabel>
      {ticks.map((tick) => {
        const tickKey = getTickKey(tick);
        return <TickRow tick={tick} key={tickKey} />;
      })}
    </Container>
  );
};
