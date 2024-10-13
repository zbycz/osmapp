import { Alert, Button } from '@mui/material';
import React from 'react';
import { useOsmAuthContext } from '../../../utils/OsmAuthContext';
import { t, Translation } from '../../../../services/intl';

export const OsmUserLogged = () => {
  const { loggedIn, osmUser, handleLogout } = useOsmAuthContext();

  if (!loggedIn) return null;

  return (
    <Alert
      severity="info"
      action={
        <Button onClick={handleLogout} color="inherit">
          {t('editdialog.logout')}
        </Button>
      }
    >
      <Translation id="editdialog.loggedInMessage" values={{ osmUser }} />
    </Alert>
  );
};
