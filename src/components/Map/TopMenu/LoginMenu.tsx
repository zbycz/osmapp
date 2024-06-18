import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import React, { forwardRef } from 'react';
import { Menu, MenuItem } from '@mui/material';
import styled from 'styled-components';
import { useBoolState } from '../../helpers';
import { t } from '../../../services/intl';
import { useOsmAuthContext } from '../../utils/OsmAuthContext';
import { LoginIconButton } from './LoginIconButton';

const StyledAccountCircleIcon = styled(AccountCircleIcon)`
  color: ${({ theme }) => theme.palette.action.active};
  margin: -2px 6px 0 0;
  font-size: 17px !important;
`;

type Props = {
  closeMenu: () => void;
};

const UserLogin = forwardRef<SVGSVGElement, Props>(({ closeMenu }, ref) => {
  const { osmUser, handleLogin, handleLogout } = useOsmAuthContext();
  const login = () => {
    closeMenu();
    handleLogin();
  };
  const logout = () => {
    closeMenu();
    setTimeout(() => {
      handleLogout();
    }, 100);
  };

  if (!osmUser) {
    return (
      <MenuItem onClick={login}>
        <StyledAccountCircleIcon ref={ref} />
        {t('user.login_register')}
      </MenuItem>
    );
  }

  return (
    <>
      <MenuItem
        component="a"
        href={`https://www.openstreetmap.org/user/${osmUser}`}
        target="_blank"
        rel="noopener"
        onClick={closeMenu}
      >
        <StyledAccountCircleIcon ref={ref} />
        <strong>{osmUser}</strong>
      </MenuItem>
      <MenuItem onClick={logout}>{t('user.logout')}</MenuItem>
    </>
  );
});

// TODO custom Item components are not keyboard accesible
// seems like a bug in material-ui
// https://github.com/mui-org/material-ui/issues/22912
// https://github.com/mui-org/material-ui/issues?q=is%3Aissue+is%3Aopen+menuitem+keyboard

export const LoginMenu = () => {
  const anchorRef = React.useRef();
  const [opened, open, close] = useBoolState(false);

  return (
    <>
      <Menu
        id="login-menu"
        anchorEl={anchorRef.current}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        open={opened}
        onClose={close}
      >
        <UserLogin closeMenu={close} />
      </Menu>
      <LoginIconButton anchorRef={anchorRef} onClick={open} />
    </>
  );
};
