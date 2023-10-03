import React, { useContext } from 'react';
import {
  DialogTitle,
  Divider,
  ListItemIcon,
  MenuItem,
  MenuList,
  Popover,
  Typography,
} from '@material-ui/core';
import RemoveCircleIcon from '@material-ui/icons/RemoveCircle';
import CloseIcon from '@material-ui/icons/Close';
import CheckIcon from '@material-ui/icons/Check';
import DeleteIcon from '@material-ui/icons/Delete';
import { ClimbingContext } from '../contexts/ClimbingContext';
import { PointType } from '../types';
import { updateElementOnIndex } from '../utils';

export const PointMenu = ({
  anchorEl,
  setAnchorEl,
  onFinishClimbingRouteClick,
}) => {
  const {
    routeSelectedIndex,
    routes,
    pointSelectedIndex,
    setPointSelectedIndex,
    updateRouteOnIndex,
    useMachine,
  } = useContext(ClimbingContext);
  const machine = useMachine();
  const open = Boolean(anchorEl);
  const id = open ? 'simple-popper' : undefined;
  const route = routes[routeSelectedIndex];
  if (!route) return null;
  const selectedPoint = route.path[pointSelectedIndex];
  if (!selectedPoint) return null;

  const onPopoverClose = () => {
    setAnchorEl(null);
    setPointSelectedIndex(null);
  };
  const onDeletePoint = () => {
    machine.execute('deletePoint');
    updateRouteOnIndex(routeSelectedIndex, (currentRoute) => ({
      ...currentRoute,
      path: updateElementOnIndex(currentRoute.path, pointSelectedIndex),
    }));
    setAnchorEl(null);
    setPointSelectedIndex(null);
  };

  const onPointTypeChange = (type: PointType) => {
    machine.execute('changePointType');
    updateRouteOnIndex(routeSelectedIndex, (currentRoute) => ({
      ...currentRoute,
      path: updateElementOnIndex(
        currentRoute.path,
        pointSelectedIndex,
        (point) => ({
          ...point,
          type,
        }),
      ),
    }));

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
      onClose={() => {
        machine.execute('cancelPointMenu');
        onPopoverClose();
      }}
    >
      <DialogTitle>Choose point type</DialogTitle>

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
        <Divider />
        <MenuItem onClick={onDeletePoint}>
          <ListItemIcon>
            <DeleteIcon fontSize="small" />
          </ListItemIcon>
          <Typography variant="inherit" noWrap>
            Delete point
          </Typography>
        </MenuItem>
        <MenuItem
          onClick={() => {
            onPopoverClose();
            onFinishClimbingRouteClick();
          }}
        >
          <ListItemIcon>
            <CheckIcon fontSize="small" />
          </ListItemIcon>
          <Typography variant="inherit" noWrap>
            Finish editing
          </Typography>
        </MenuItem>
      </MenuList>
    </Popover>
  );
};
