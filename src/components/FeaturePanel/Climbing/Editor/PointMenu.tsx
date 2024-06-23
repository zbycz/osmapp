import React from 'react';

import RemoveCircleIcon from '@mui/icons-material/RemoveCircle';
import CloseIcon from '@mui/icons-material/Close';
import CheckIcon from '@mui/icons-material/Check';
import DeleteIcon from '@mui/icons-material/Delete';
import {
  Popover,
  DialogTitle,
  MenuList,
  MenuItem,
  ListItemIcon,
  Typography,
  Divider,
} from '@mui/material';
import { PointType } from '../types';
import { useClimbingContext } from '../contexts/ClimbingContext';

export const PointMenu = ({ anchorEl, setAnchorEl }) => {
  const {
    pointSelectedIndex,
    setPointSelectedIndex,
    getMachine,
    isPointMoving,
    getCurrentPath,
  } = useClimbingContext();
  const machine = getMachine();
  const open = Boolean(anchorEl) && !isPointMoving;
  const id = open ? 'simple-popper' : undefined;
  const selectedPoint = getCurrentPath()[pointSelectedIndex];

  if (!selectedPoint) return null;

  const onPopoverClose = () => {
    setAnchorEl(null);
    setPointSelectedIndex(null);
  };
  const onDeletePoint = () => {
    machine.execute('deletePoint');
  };

  const onPointTypeChange = (type: PointType) => {
    machine.execute('changePointType', { type });

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
          dense
          onClick={() => onPointTypeChange(null)}
          selected={!selectedPoint.type}
        >
          <ListItemIcon />
          <Typography variant="inherit">Nothing</Typography>
        </MenuItem>
        <MenuItem
          dense
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
          dense
          onClick={() => onPointTypeChange('anchor')}
          selected={selectedPoint.type === 'anchor'}
        >
          <ListItemIcon>
            <RemoveCircleIcon fontSize="small" />
          </ListItemIcon>
          <Typography variant="inherit">Belay</Typography>
        </MenuItem>
        <Divider />
        <MenuItem onClick={onDeletePoint} dense>
          <ListItemIcon>
            <DeleteIcon fontSize="small" />
          </ListItemIcon>
          <Typography variant="inherit" noWrap>
            Delete point
          </Typography>
        </MenuItem>
        <MenuItem
          dense
          onClick={() => {
            onPopoverClose();
            machine.execute('finishRoute');
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
