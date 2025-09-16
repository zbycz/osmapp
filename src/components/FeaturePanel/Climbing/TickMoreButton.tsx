import React, { useState } from 'react';
import { CircularProgress, IconButton, MenuItem } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import { useSnackbar } from '../../utils/SnackbarContext';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import { useMoreMenu } from './useMoreMenu';
import { ClimbingTick } from '../../../types';
import { useTicksContext } from '../../utils/TicksContext';

type DeleteTickMenuItemProps = {
  tick: ClimbingTick;
  closeMenu: (e: React.MouseEvent) => void;
};

const DeleteTickMenuItem = ({ tick, closeMenu }: DeleteTickMenuItemProps) => {
  const { showToast } = useSnackbar();
  const { deleteTickFromDb } = useTicksContext();
  const [loading, setLoading] = useState(false);

  const onClick = async (event: React.MouseEvent) => {
    event.stopPropagation();

    setLoading(true);
    try {
      await deleteTickFromDb(tick.id);
      showToast('Tick was deleted', 'success');
    } catch (e) {
      showToast(`Error: ${e}`, 'error');
    } finally {
      setLoading(false);
      closeMenu(event);
    }
  };

  return (
    <MenuItem onClick={onClick} disableRipple>
      <DeleteIcon />
      Delete tick &nbsp;
      {loading && <CircularProgress size={24} />}
    </MenuItem>
  );
};

type Props = {
  tick: ClimbingTick;
};

export const TickMoreButton = ({ tick }: Props) => {
  const { MoreMenu, handleClickMore, handleCloseMore } = useMoreMenu();
  const { setEditedTickId } = useTicksContext();

  return (
    <>
      <IconButton color="secondary" onClick={handleClickMore}>
        <MoreHorizIcon color="secondary" />
      </IconButton>

      <MoreMenu>
        <MenuItem
          onClick={(e) => {
            setEditedTickId(tick.id);
            handleCloseMore(e);
          }}
          disableRipple
        >
          <EditIcon />
          Edit tick
        </MenuItem>{' '}
        <DeleteTickMenuItem tick={tick} closeMenu={handleCloseMore} />
      </MoreMenu>
    </>
  );
};
