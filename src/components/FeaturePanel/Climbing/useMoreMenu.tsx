import React from 'react';
import { Menu } from '@mui/material';

export const useMoreMenu = () => {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const handleClickMore = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
    event.preventDefault();
    event.stopPropagation();
  };

  const handleCloseMore = (event) => {
    setAnchorEl(null);
    event.stopPropagation();
  };

  const MoreMenu = ({ children }) => (
    <Menu anchorEl={anchorEl} open={open} onClose={handleCloseMore}>
      {children}
    </Menu>
  );

  return { anchorEl, open, handleClickMore, handleCloseMore, MoreMenu };
};
