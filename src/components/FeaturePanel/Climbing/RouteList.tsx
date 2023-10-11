import React from 'react';
import styled from 'styled-components';
import {
  Box,
  Button,
  Collapse,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
} from '@material-ui/core';
import DeleteIcon from '@material-ui/icons/Delete';
import GestureIcon from '@material-ui/icons/Gesture';
import KeyboardArrowUpIcon from '@material-ui/icons/KeyboardArrowUp';
import KeyboardArrowDownIcon from '@material-ui/icons/KeyboardArrowDown';
import AddIcon from '@material-ui/icons/Add';
import { emptyRoute } from './utils/emptyRoute';
import { ClimbingRoute } from './types';
import { useClimbingContext } from './contexts/ClimbingContext';

type Props = {
  onCreateSchemaForExistingRouteClick: (
    updatedRouteSelectedIndex: number,
  ) => void;
  onDeleteExistingRouteClick: (deletedExistingRouteIndex: number) => void;
  isReadOnly: boolean;
};
const Container = styled.div`
  flex: 1;
  overflow: auto;
`;

const EmptyValue = styled.div`
  color: #666;
`;

const RenderRow = ({
  route,
  isReadOnly,
  index,
  onRowClick,
  routeSelectedIndex,
  onRouteChange,
  onCreateSchemaForExistingRouteClick,
  onDeleteExistingRouteClick,
}) => {
  const { name, difficulty, path } = route;
  const getText = (field: keyof ClimbingRoute) =>
    route[field] !== '' ? route[field] : <EmptyValue>?</EmptyValue>;
  const [open, setOpen] = React.useState(false);

  return (
    <>
      <TableRow
        onClick={() => onRowClick(index)}
        selected={routeSelectedIndex === index}
        style={{ cursor: 'pointer' }}
      >
        <TableCell width={50}>
          <IconButton
            aria-label="expand row"
            size="small"
            onClick={() => setOpen(!open)}
          >
            {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
          </IconButton>
        </TableCell>
        <TableCell component="th" scope="row" width={70}>
          {index}
        </TableCell>
        <TableCell>
          {isReadOnly ? (
            getText('name')
          ) : (
            <TextField
              size="small"
              value={name}
              placeholder="No name"
              onChange={(e) => onRouteChange(e, index, 'name')}
              fullWidth
              variant="outlined"
            />
          )}
        </TableCell>
        <TableCell width={50}>
          {isReadOnly ? (
            getText('difficulty')
          ) : (
            <TextField
              size="small"
              value={difficulty}
              placeholder="6+"
              onChange={(e) => onRouteChange(e, index, 'difficulty')}
              variant="outlined"
            />
          )}
        </TableCell>

        {!isReadOnly && (
          <TableCell align="right" width={120}>
            <>
              {path.length === 0 && (
                <IconButton
                  onClick={() => onCreateSchemaForExistingRouteClick(index)}
                  color="primary"
                  title="Draw route to schema"
                >
                  <GestureIcon fontSize="small" />
                </IconButton>
              )}
              <IconButton
                onClick={() => onDeleteExistingRouteClick(index)}
                color="primary"
                title="Delete route"
              >
                <DeleteIcon fontSize="small" />
              </IconButton>
            </>
          </TableCell>
        )}
      </TableRow>
      <TableRow>
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Box>TODO</Box>
          </Collapse>
        </TableCell>
      </TableRow>
    </>
  );
};

export const RouteList = ({
  onCreateSchemaForExistingRouteClick,
  onDeleteExistingRouteClick,
  isReadOnly = false,
}: Props) => {
  const {
    setRouteSelectedIndex,
    routes,
    setRoutes,
    routeSelectedIndex,
    updateRouteOnIndex,
  } = useClimbingContext();

  const onRouteChange = (e, index, updatedField) => {
    updateRouteOnIndex(routeSelectedIndex, (route) => ({
      ...route,
      [updatedField]: e.target.value,
    }));
  };

  const onNewRouteCreate = () => {
    setRoutes([...routes, emptyRoute]);
  };

  const onRowClick = (index: number) => {
    setRouteSelectedIndex(index);
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
            {routes.map((route, index) => (
              <RenderRow
                route={route}
                index={index}
                onRowClick={onRowClick}
                isReadOnly={isReadOnly}
                routeSelectedIndex={routeSelectedIndex}
                onRouteChange={onRouteChange}
                onCreateSchemaForExistingRouteClick={
                  onCreateSchemaForExistingRouteClick
                }
                onDeleteExistingRouteClick={onDeleteExistingRouteClick}
              />
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Container>
  );
};
