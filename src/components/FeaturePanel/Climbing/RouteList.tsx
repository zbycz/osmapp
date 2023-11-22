import React from 'react';
import styled from 'styled-components';
import {
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from '@material-ui/core';
import AddIcon from '@material-ui/icons/Add';
import { emptyRoute } from './utils/emptyRoute';
import { useClimbingContext } from './contexts/ClimbingContext';
import Dnd from './Dnd';

// type Item = {
//   id: number;
//   content: React.ReactNode;
// };

type Props = {
  // onDeleteExistingRouteClick: (deletedExistingRouteIndex: number) => void;
  isReadOnly: boolean;
};
const Container = styled.div`
  flex: 1;
  overflow: auto;
  padding-top: 10px;
`;

// const Row = styled.div`
//   display: flex;
// `;
// const Number = styled.div``;
// const Name = styled.div``;
// const Difficulty = styled.div``;
// const Actions = styled.div``;

export const RouteList = ({
  // onDeleteExistingRouteClick,
  isReadOnly = false,
}: Props) => {
  const { routes, setRoutes } = useClimbingContext();

  const onNewRouteCreate = () => {
    setRoutes([...routes, emptyRoute]);
  };

  if (isReadOnly && routes.length === 0) return null;

  return (
    <Container>
      <TableContainer>
        <Table size="small">
          {!isReadOnly && (
            <caption>
              {' '}
              <Button
                onClick={onNewRouteCreate}
                color="primary"
                variant="text"
                size="small"
                startIcon={<AddIcon />}
              >
                Add new route
              </Button>
            </caption>
          )}
          <TableHead>
            <TableRow>
              <TableCell />
              <TableCell>N°</TableCell>
              <TableCell>Route name</TableCell>
              <TableCell align="right">Difficulty</TableCell>
              {!isReadOnly && <TableCell align="right">&nbsp;</TableCell>}
            </TableRow>
          </TableHead>
          <TableBody>
            <Dnd isReadOnly={isReadOnly} />
          </TableBody>
        </Table>
      </TableContainer>
    </Container>
  );
};
