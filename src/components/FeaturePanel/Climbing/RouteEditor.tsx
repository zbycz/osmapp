import React, { useContext } from 'react';
import styled from 'styled-components';
import {
  Box,
  Button,
  Divider,
  ListItemIcon,
  MenuItem,
  MenuList,
  Popover,
  Typography,
} from '@material-ui/core';
import RemoveCircleIcon from '@material-ui/icons/RemoveCircle';
import CloseIcon from '@material-ui/icons/Close';
// import SwipeDownAltIcon from '@mui/icons-material/SwipeDownAlt';
// import RemoveIcon from '@mui/icons-material/Remove';

import type { ClimbingRoute, PointType } from './types';
import { RouteNumber } from './RouteNumber';
import { ClimbingEditorContext } from './contexts/climbingEditorContext';
import { Route } from './Route';

const Svg = styled.svg<{
  isEditable: boolean;
  imageSize: { width: number; height: number };
}>`
  position: absolute;
  left: 0;
  top: 0;
  ${({ isEditable }) => `cursor: ${isEditable ? 'crosshair' : 'auto'}`};
  ${({ imageSize: { width, height } }) =>
    `width: ${width}px;
    height:${height}px;`}
`;

type Props = {
  route: ClimbingRoute;
  routeNumber: number;
  onRouteSelect: (routeNumber: number) => void;
  onPointClick: (
    event: React.MouseEvent<SVGCircleElement>,
    index: number,
  ) => void;
};

const RouteWithLabel = ({
  route,
  routeNumber,
  onRouteSelect,
  onPointClick,
}: Props) => {
  if (!route || route.path.length === 0) return null;

  const { imageSize, routeSelectedIndex } = useContext(ClimbingEditorContext);

  const x = imageSize.width * route?.path[0].x;
  const y = imageSize.height * route?.path[0].y;

  if (route?.path.length === 1) {
    return (
      <>
        <circle cx={x} cy={y} r={4} strokeWidth="0" fill="white" />
        <circle cx={x} cy={y} r={2.5} strokeWidth="0" fill="royalblue" />
        <RouteNumber
          onRouteSelect={onRouteSelect}
          x={x}
          y={y}
          routeSelectedIndex={routeSelectedIndex}
        >
          {routeNumber}
        </RouteNumber>
      </>
    );
  }

  return (
    <>
      <Route
        onRouteSelect={onRouteSelect}
        routeNumber={routeNumber}
        route={route}
        onPointClick={onPointClick}
      />

      <RouteNumber
        onRouteSelect={onRouteSelect}
        x={x}
        y={y}
        routeSelectedIndex={routeSelectedIndex}
      >
        {routeNumber}
      </RouteNumber>
    </>
  );
};

export const RouteEditor = ({ routes, onClick, onRouteSelect }) => {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);

  const {
    imageSize,
    isSelectedRouteEditable,
    routeSelectedIndex,
    setRoutes,
    pointSelectedIndex,
  } = useContext(ClimbingEditorContext);

  const onPointClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(anchorEl !== null ? null : event.currentTarget);
  };

  const open = Boolean(anchorEl);

  const id = open ? 'simple-popper' : undefined;

  const onPopoverClose = () => {
    setAnchorEl(null);
  };

  const onPointTypeChange = (type: PointType) => {
    const route = routes[routeSelectedIndex];

    setRoutes([
      ...routes.slice(0, routeSelectedIndex),
      {
        ...route,
        path: [
          ...route.path.slice(0, pointSelectedIndex),
          { ...route.path[pointSelectedIndex], type },
          ...route.path.slice(pointSelectedIndex + 1),
        ],
      },
      ...routes.slice(routeSelectedIndex + 1),
    ]);
    onPopoverClose();
  };

  return (
    <>
      <Svg
        isEditable={isSelectedRouteEditable}
        onClick={(e) => {
          onClick(e);
        }}
        imageSize={imageSize}
      >
        {routes.map((route, index) => (
          <RouteWithLabel
            route={route}
            routeNumber={index}
            onRouteSelect={onRouteSelect}
            onPointClick={(e) => onPointClick(e)}
          />
        ))}
      </Svg>

      <Popover
        id={id}
        open={open}
        anchorEl={anchorEl}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left',
        }}
        onClose={onPopoverClose}
      >
        <Box marginLeft={2} marginTop={1}>
          <Typography variant="caption" display="block" gutterBottom>
            Choose point type:
          </Typography>
        </Box>
        <Divider />
        <MenuList>
          <MenuItem onClick={() => onPointTypeChange(null)}>
            <ListItemIcon />
            <Typography variant="inherit">Nothing</Typography>
          </MenuItem>
          <MenuItem onClick={() => onPointTypeChange('bolt')}>
            <ListItemIcon>
              <CloseIcon fontSize="small" />
            </ListItemIcon>
            <Typography variant="inherit" noWrap>
              Bolt / Ring / Hanger
            </Typography>
          </MenuItem>
          <MenuItem onClick={() => onPointTypeChange('belay')}>
            <ListItemIcon>
              <RemoveCircleIcon fontSize="small" />
            </ListItemIcon>
            <Typography variant="inherit">Belay</Typography>
          </MenuItem>
        </MenuList>
        <Divider />
        <Box marginLeft={2} marginY={1}>
          <Button size="small">Delete point</Button>
        </Box>
      </Popover>
    </>
  );
};
