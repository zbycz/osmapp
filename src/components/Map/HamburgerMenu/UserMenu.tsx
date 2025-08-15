import React, { forwardRef } from 'react';
import {
  Avatar,
  IconButton,
  ListItemIcon,
  ListItemText,
  MenuItem,
  Stack,
  Typography,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { t } from '../../../services/intl';
import { useOsmAuthContext } from '../../utils/OsmAuthContext';
import { LoginIconButton } from './LoginIconButton';
import { UserSettingsItem } from './UserSettingsItem';

type UserLoginProps = {
  closeMenu: () => void;
};

function HeaderIcons(props: { onClick: () => void }) {
  return (
    <Stack direction="row">
      <UserSettingsItem />
      <IconButton onClick={props.onClick}>
        <CloseIcon />
      </IconButton>
    </Stack>
  );
}

const LoggedUserHeader = ({
  onClose,
  onLogout,
  osmUser,
}: {
  osmUser: string;
  onLogout: () => void;
  onClose: () => void;
}) => (
  <Stack
    direction="row"
    justifyContent="space-between"
    gap={1}
    alignItems="center"
    m={1}
    mt={2}
    mb={2}
  >
    <Stack direction="row" gap={1.5} alignItems="center">
      <LoginIconButton size={32} />
      <Stack direction="column" justifyContent="center">
        <Typography
          component="a"
          href={`https://www.openstreetmap.org/user/${osmUser}`}
          target="_blank"
          rel="noopener"
          color="text.primary"
          variant="button"
        >
          {osmUser}
        </Typography>
        <Typography
          variant="caption"
          onClick={onLogout}
          textTransform="lowercase"
          color="text.secondary"
          sx={{ cursor: 'pointer' }}
        >
          {t('user.logout')}
        </Typography>
      </Stack>
    </Stack>
    <HeaderIcons onClick={onClose} />
  </Stack>
);

const LoggedOutUserHeader = ({
  onClose,
  onLogIn,
}: {
  onLogIn: () => void;
  onClose: () => void;
}) => (
  <Stack
    direction="row"
    gap={1}
    alignItems="center"
    justifyContent="space-between"
    mt={1}
  >
    <MenuItem onClick={onLogIn}>
      <ListItemIcon>
        <Avatar sx={{ width: 24, height: 24 }} />
      </ListItemIcon>
      <ListItemText>{t('user.login_register')}</ListItemText>
    </MenuItem>
    <HeaderIcons onClick={onClose} />
  </Stack>
);

export const UserHeader = forwardRef<SVGSVGElement, UserLoginProps>(
  ({ closeMenu }) => {
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
      return <LoggedOutUserHeader onLogIn={login} onClose={closeMenu} />;
    }

    return (
      <LoggedUserHeader
        osmUser={osmUser}
        onLogout={logout}
        onClose={closeMenu}
      />
    );
  },
);
UserHeader.displayName = 'UserLogin';
