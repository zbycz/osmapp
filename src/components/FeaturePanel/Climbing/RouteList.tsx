import React from 'react';
import styled from 'styled-components';
import { Grid, TextField } from '@material-ui/core';
import type { ClimbingRoute } from './types';

const Line = styled.div<{ isSelected: boolean }>`
  ${({ isSelected }) => `background: ${isSelected ? 'gray' : 'transparent'}`}
`;

type Props = {
  routes: Array<ClimbingRoute>;
  routeSelected: number;
  setRoutes: (routes: Array<ClimbingRoute>) => void;
};

export const RouteList = ({ routes, routeSelected, setRoutes }: Props) => {
  const onRouteChange = (e, index, updatedField) => {
    const updatedRoute = { ...routes[index], [updatedField]: e.target.value };
    const newRoutes = [
      ...routes.slice(0, index),
      updatedRoute,
      ...routes.slice(index + 1),
    ];
    setRoutes(newRoutes);
  };

  return (
    <div>
      {routes.map(({ name, difficulty }, index) => (
        <Line isSelected={routeSelected === index}>
          <Grid container spacing={2}>
            <Grid item xs={6} md={8}>
              <TextField
                label="Route name"
                value={name}
                placeholder="No name"
                onChange={(e) => onRouteChange(e, index, 'name')}
                fullWidth
              />
            </Grid>
            <Grid item xs={6} md={4}>
              <TextField
                label="Difficulty"
                value={difficulty}
                placeholder="6+"
                onChange={(e) => onRouteChange(e, index, 'difficulty')}
              />
            </Grid>
          </Grid>
        </Line>
      ))}
    </div>
  );
};
