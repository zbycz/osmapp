import React, { forwardRef } from 'react';
import {
  Avatar,
  IconButton,
  ListItemIcon,
  ListItemText,
  MenuItem,
  Stack,
  styled,
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

const HeaderIcons = (props: { onClick: () => void }) => (
  <Stack direction="row">
    <UserSettingsItem />
    <IconButton onClick={props.onClick}>
      <CloseIcon />
    </IconButton>
  </Stack>
);

const StyleLogoutText = styled(Typography)`
  cursor: pointer;
  &:hover {
    opacity: 0.8;
  }
`;
const LogoutButton = ({ onClick }: { onClick: () => void }) => (
  <StyleLogoutText // TODO make it a Button for accessibility
    variant="caption"
    onClick={onClick}
    textTransform="lowercase"
    color="text.secondary"
    sx={{ cursor: 'pointer' }}
  >
    {t('user.logout')}
  </StyleLogoutText>
);

const StyleUserLink = styled('a')`
  color: ${({ theme }) => theme.palette.text.primary};
  max-width: 120px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;
const OsmUserLink = ({ osmUser }: { osmUser: string }) => (
  <StyleUserLink
    href={`https://www.openstreetmap.org/user/${osmUser}`}
    target="_blank"
    rel="noopener"
    color="text.primary"
    variant="body1"
  >
    {osmUser}
  </StyleUserLink>
);

const LoggedUserHeader = ({ onClose }: { onClose: () => void }) => {
  const { osmUser, handleLogout } = useOsmAuthContext();

  return (
    <Stack
      direction="row"
      justifyContent="space-between"
      gap={1}
      alignItems="center"
      m={1}
      mt={2}
      mb={2}
    >
      <Stack direction="row" gap={1.5} alignItems="center" ml={0.5}>
        <LoginIconButton size={32} />
        <Stack direction="column" justifyContent="center">
          <OsmUserLink osmUser={osmUser} />
          <LogoutButton onClick={handleLogout} />
        </Stack>
      </Stack>
      <HeaderIcons onClick={onClose} />
    </Stack>
  );
};

const LoggedOutUserHeader = ({ onClose }: { onClose: () => void }) => {
  const { handleLogin } = useOsmAuthContext();

  return (
    <Stack
      direction="row"
      gap={1}
      alignItems="center"
      justifyContent="space-between"
      mt={1}
    >
      <MenuItem onClick={handleLogin}>
        <ListItemIcon>
          <Avatar sx={{ width: 24, height: 24 }} />
        </ListItemIcon>
        <ListItemText>{t('user.login_register')}</ListItemText>
      </MenuItem>
      <HeaderIcons onClick={onClose} />
    </Stack>
  );
};

export const UserHeader = forwardRef<SVGSVGElement, UserLoginProps>(
  ({ closeMenu }) => {
    const { osmUser } = useOsmAuthContext();
    if (!osmUser) {
      return <LoggedOutUserHeader onClose={closeMenu} />;
    }

    return <LoggedUserHeader onClose={closeMenu} />;
  },
);
UserHeader.displayName = 'UserLogin';
