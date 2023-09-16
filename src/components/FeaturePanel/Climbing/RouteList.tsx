import React, { useContext } from 'react';
import styled from 'styled-components';
import { Button, Grid, IconButton, TextField } from '@material-ui/core';
import GestureIcon from '@material-ui/icons/Gesture';
import AddIcon from '@material-ui/icons/Add';
import { emptyRoute } from './utils/emptyRoute';
import { ClimbingEditorContext } from './contexts/climbingEditorContext';

const Row = styled.div<{ isSelected: boolean }>`
  ${({ isSelected }) => `background: ${isSelected ? 'gray' : 'transparent'}`};
  cursor: pointer;
  width: 100%;
`;

type Props = {
  onUpdateExistingRouteClick: (updatedRouteSelectedIndex: number) => void;
};

export const RouteList = ({ onUpdateExistingRouteClick }: Props) => {
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
      {routes.map(({ name, difficulty, path }, index) => (
        <Row
          isSelected={routeSelectedIndex === index}
          onClick={() => onRowClick(index)}
        >
          <Grid container spacing={2}>
            <Grid item>{index}</Grid>
            <Grid item xs={6}>
              <TextField
                size="small"
                label="Route name"
                value={name}
                placeholder="No name"
                onChange={(e) => onRouteChange(e, index, 'name')}
                fullWidth
                variant="filled"
              />
            </Grid>
            <Grid item xs={1}>
              <TextField
                size="small"
                label="Difficulty"
                value={difficulty}
                placeholder="6+"
                onChange={(e) => onRouteChange(e, index, 'difficulty')}
                variant="filled"
              />
            </Grid>
            <Grid item>
              {path.length === 0 && (
                <IconButton
                  onClick={() => onUpdateExistingRouteClick(index)}
                  color="secondary"
                  title="Draw route to schema"
                >
                  <GestureIcon fontSize="small" />
                </IconButton>
              )}
            </Grid>
          </Grid>
        </Row>
      ))}
      <Button
        onClick={onNewRouteCreate}
        color="secondary"
        variant="text"
        size="small"
        startIcon={<AddIcon />}
      >
        Add new route
      </Button>
    </div>
  );
};
