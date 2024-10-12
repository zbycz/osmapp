import React from 'react';
import { Alert, Box, Button } from '@mui/material';
import { useOsmAuthContext } from '../../../utils/OsmAuthContext';
import { t, Translation } from '../../../../services/intl';

export const OsmUserLoggedOut = () => {
  const { loggedIn, handleLogin } = useOsmAuthContext();

  if (loggedIn) return null;

  return (
    <Box sx={{ marginBottom: 2 }}>
      <Alert
        severity="warning"
        action={
          <Button sx={{ whiteSpace: 'nowrap' }} onClick={handleLogin}>
            {t('user.login_register')}
          </Button>
        }
      >
        <Translation id="editdialog.anonymousMessage" />
      </Alert>
    </Box>
  );
};
