import React, { useContext } from 'react';
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
import { ClimbingEditorContext } from './contexts/climbingEditorContext';
import { PointType } from './types';

export const PointMenu = ({ anchorEl, setAnchorEl }) => {
  const { routeSelectedIndex, routes, setRoutes, pointSelectedIndex } =
    useContext(ClimbingEditorContext);
  const open = Boolean(anchorEl);
  const id = open ? 'simple-popper' : undefined;
  const route = routes[routeSelectedIndex];
  if (!route) return null;
  const selectedPoint = route.path[pointSelectedIndex];
  if (!selectedPoint) return null;

  const onPopoverClose = () => {
    setAnchorEl(null);
  };

  const onPointTypeChange = (type: PointType) => {
    setRoutes([
      ...routes.slice(0, routeSelectedIndex),
      {
        ...route,
        path: [
          ...route.path.slice(0, pointSelectedIndex),
          { ...selectedPoint, type },
          ...route.path.slice(pointSelectedIndex + 1),
        ],
      },
      ...routes.slice(routeSelectedIndex + 1),
    ]);
    onPopoverClose();
  };

  return (
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
        <MenuItem
          onClick={() => onPointTypeChange(null)}
          selected={!selectedPoint.type}
        >
          <ListItemIcon />
          <Typography variant="inherit">Nothing</Typography>
        </MenuItem>
        <MenuItem
          onClick={() => onPointTypeChange('bolt')}
          selected={selectedPoint.type === 'bolt'}
        >
          <ListItemIcon>
            <CloseIcon fontSize="small" />
          </ListItemIcon>
          <Typography variant="inherit" noWrap>
            Bolt / Ring / Hanger
          </Typography>
        </MenuItem>
        <MenuItem
          onClick={() => onPointTypeChange('belay')}
          selected={selectedPoint.type === 'belay'}
        >
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
  );
};
