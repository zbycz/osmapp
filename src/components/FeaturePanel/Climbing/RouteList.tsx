import React, { useContext } from 'react';
import styled from 'styled-components';
import {
  Button,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
} from '@material-ui/core';
import GestureIcon from '@material-ui/icons/Gesture';
import AddIcon from '@material-ui/icons/Add';
import { emptyRoute } from './utils/emptyRoute';
import { ClimbingEditorContext } from './contexts/climbingEditorContext';
import { ClimbingRoute } from './types';

type Props = {
  onUpdateExistingRouteClick: (updatedRouteSelectedIndex: number) => void;
  isReadOnly: boolean;
};
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
  onUpdateExistingRouteClick,
}) => {
  const { name, difficulty, path } = route;
  const getText = (field: keyof ClimbingRoute) =>
    route[field] !== '' ? route[field] : <EmptyValue>?</EmptyValue>;
  return (
    <TableRow
      onClick={() => onRowClick(index)}
      selected={routeSelectedIndex === index}
      style={{ cursor: 'pointer' }}
    >
      <TableCell component="th" scope="row">
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

      <TableCell align="right">
        {!isReadOnly && path.length === 0 && (
          <IconButton
            onClick={() => onUpdateExistingRouteClick(index)}
            color="primary"
            title="Draw route to schema"
          >
            <GestureIcon fontSize="small" />
          </IconButton>
        )}
      </TableCell>
    </TableRow>
  );
};

export const RouteList = ({
  onUpdateExistingRouteClick,
  isReadOnly = false,
}: Props) => {
  const { setRouteSelectedIndex, routes, setRoutes, routeSelectedIndex } =
    useContext(ClimbingEditorContext);

  const onRouteChange = (e, index, updatedField) => {
    const updatedRoute = { ...routes[index], [updatedField]: e.target.value };
    const newRoutes = [
      ...routes.slice(0, index),
      updatedRoute,
      ...routes.slice(index + 1),
    ];
    setRoutes(newRoutes);
  };

  const onNewRouteCreate = () => {
    setRoutes([...routes, emptyRoute]);
  };

  const onRowClick = (index: number) => {
    setRouteSelectedIndex(index);
  };

  return (
    <div>
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
              <TableCell>N°</TableCell>
              <TableCell>Route name</TableCell>
              <TableCell align="right">Difficulty</TableCell>
              <TableCell align="right">&nbsp;</TableCell>
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
                onUpdateExistingRouteClick={onUpdateExistingRouteClick}
              />
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
};
