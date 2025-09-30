import React, { useState } from 'react';
import { UserSettingsDialog } from '../../HomepagePanel/UserSettingsDialog';
import { IconButton, Tooltip } from '@mui/material';
import { t } from '../../../services/intl';
import SettingsIcon from '@mui/icons-material/Settings';

type UserSettingsItemProps = {
  closeMenu?: () => void;
};

export const UserSettingsItem = ({ closeMenu }: UserSettingsItemProps) => {
  const [isUserSettingsOpened, setIsUserSettingsOpened] =
    useState<boolean>(false);

  const openUserSettings = () => {
    setIsUserSettingsOpened(true);
  };

  const closeUserSettings = () => {
    setIsUserSettingsOpened(false);
    closeMenu?.();
  };

  return (
    <>
      <UserSettingsDialog
        isOpened={isUserSettingsOpened}
        onClose={closeUserSettings}
      />
      <Tooltip title={t('user.user_settings')}>
        <IconButton onClick={openUserSettings}>
          <SettingsIcon />
        </IconButton>
      </Tooltip>
    </>
  );
};
