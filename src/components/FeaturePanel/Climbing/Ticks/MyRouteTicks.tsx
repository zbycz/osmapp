import React from 'react';
import styled from 'styled-components';
import { Table } from '@mui/material';
import { findTicks, getTickKey } from '../../../../services/ticks';
import { PanelLabel } from '../PanelLabel';
import { TickRow } from '../TickRow';
import { AddTickButton } from './AddTickButton';

const Container = styled.div`
  margin-bottom: 20px;
`;
const Row = styled.div`
  display: flex;
  justify-content: flex-end;
  margin: 20px 10px;
`;

export const MyRouteTicks = ({ shortOsmId }) => {
  const ticks = findTicks(shortOsmId);
  if (ticks.length === 0)
    return (
      <Row>
        <AddTickButton shortOsmId={shortOsmId} />
      </Row>
    );

  return (
    <Container>
      <PanelLabel addition={<AddTickButton shortOsmId={shortOsmId} />}>
        Route ticks
      </PanelLabel>
      <Table size="small">
        {ticks.map((tick) => {
          const tickKey = getTickKey(tick);
          return <TickRow tick={tick} key={tickKey} />;
        })}
      </Table>
    </Container>
  );
};
