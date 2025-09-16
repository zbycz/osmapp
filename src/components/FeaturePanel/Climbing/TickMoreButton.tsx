import React, { useState } from 'react';
import { IconButton, MenuItem } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import { getTickKey, onTickDelete } from '../../../services/my-ticks/ticks';
import { useSnackbar } from '../../utils/SnackbarContext';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import { useMoreMenu } from './useMoreMenu';
import { EditTickModal } from './EditTickModal';

export const TickMoreButton = ({ tick }) => {
  const { MoreMenu, handleClickMore, handleCloseMore } = useMoreMenu();
  const [showEditTickModal, setShowEditTickModal] = useState(false);

  const tickKey = getTickKey(tick);
  const { showToast } = useSnackbar();

  const deleteTick = (key) => {
    onTickDelete(key);
  };

  const handleTickDelete = () => {
    deleteTick(tickKey);
    showToast('Tick was deleted', 'success');
  };

  return (
    <>
      <IconButton color="secondary" onClick={handleClickMore}>
        <MoreHorizIcon color="secondary" />
      </IconButton>

      <MoreMenu>
        <MenuItem
          onClick={(e) => {
            handleCloseMore(e);
            setShowEditTickModal(true);
          }}
          disableRipple
        >
          <EditIcon />
          Edit tick
        </MenuItem>{' '}
        <MenuItem
          onClick={(e) => {
            handleCloseMore(e);
            handleTickDelete();
          }}
          disableRipple
        >
          <DeleteIcon />
          Delete tick
        </MenuItem>
      </MoreMenu>

      <EditTickModal
        tick={tick}
        onClose={() => {
          setShowEditTickModal(false);
        }}
      />
    </>
  );
};
