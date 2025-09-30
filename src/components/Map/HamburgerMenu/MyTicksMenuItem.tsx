import Router from 'next/router';
import { ListItemIcon, ListItemText, MenuItem } from '@mui/material';
import { t } from '../../../services/intl';
import React from 'react';
import LocalFireDepartmentIcon from '@mui/icons-material/LocalFireDepartment';

type MyTicksMenuItemProps = {
  closeMenu: () => void;
};

export const MyTicksMenuItem = ({ closeMenu }: MyTicksMenuItemProps) => {
  const openMyTicks = () => {
    Router.push(`/my-ticks`);
    closeMenu();
  };

  return (
    <MenuItem onClick={openMyTicks}>
      <ListItemIcon>
        <LocalFireDepartmentIcon />
      </ListItemIcon>
      <ListItemText>{t('user.my_ticks')}</ListItemText>
    </MenuItem>
  );
};
