import Router from 'next/router';
import { Chip, ListItemIcon, ListItemText, MenuItem } from '@mui/material';
import { t } from '../../../services/intl';
import React from 'react';
import LocalFireDepartmentIcon from '@mui/icons-material/LocalFireDepartment';
import styled from '@emotion/styled';

type MyTicksMenuItemProps = {
  closeMenu: () => void;
};

const StyledChip = styled(Chip)`
  font-size: 10px;
  font-weight: 600;
  height: 14px;
  padding: 0;
  > span {
    padding: 4px;
  }
`;

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
      <ListItemText>
        {t('user.my_ticks')}{' '}
        <StyledChip label="beta" size="small" color="error" />
      </ListItemText>
    </MenuItem>
  );
};
