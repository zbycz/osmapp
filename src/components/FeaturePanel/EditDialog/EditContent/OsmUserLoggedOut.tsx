import React from 'react';
import { Alert, Box, Button, CircularProgress } from '@mui/material';
import { useOsmAuthContext } from '../../../utils/OsmAuthContext';
import { t, Translation } from '../../../../services/intl';
import LightbulbIcon from '@mui/icons-material/Lightbulb';

export const OsmUserLoggedOut = () => {
  const { loggedIn, handleLogin, loading } = useOsmAuthContext();

  if (loggedIn) return null;

  if (loading) {
    return (
      <Box sx={{ marginBottom: 2 }}>
        <Alert
          severity="info"
          icon={null}
          action={<CircularProgress size={30} color="inherit" />}
        >
          {t('editdialog.login_in_progress')}
        </Alert>
      </Box>
    );
  }

  return (
    <Box sx={{ marginBottom: 2 }}>
      <Alert
        severity="warning"
        icon={<LightbulbIcon />}
        action={
          <Button onClick={handleLogin}>{t('featurepanel.login')}</Button>
        }
      >
        <Translation id="editdialog.anonymousMessage" />
      </Alert>
    </Box>
  );
};
