import React from 'react';
import styled from '@emotion/styled';
import { Table } from '@mui/material';
import { findTicks, getTickKey } from '../../../../services/my-ticks/ticks';
import { PanelLabel } from '../PanelLabel';
import { RouteTickRow } from '../RouteTickRow';
import { AddTickButton } from './AddTickButton';
import { ClientOnly } from '../../../helpers';

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
    <ClientOnly>
      <Container>
        <PanelLabel addition={<AddTickButton shortOsmId={shortOsmId} />}>
          Route ticks
        </PanelLabel>
        <Table size="small">
          {ticks.map((tick) => {
            const tickKey = getTickKey(tick);
            return <RouteTickRow tick={tick} key={tickKey} />;
          })}
        </Table>
      </Container>
    </ClientOnly>
  );
};
