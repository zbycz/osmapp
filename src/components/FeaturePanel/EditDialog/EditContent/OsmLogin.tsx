import { Typography } from '@mui/material';
import React from 'react';
import { useOsmAuthContext } from '../../../utils/OsmAuthContext';
import { t, Translation } from '../../../../services/intl';

export const OsmLogin = () => {
  const { loggedIn, osmUser, handleLogin, handleLogout } = useOsmAuthContext();

  return (
    <Typography variant="body2" color="textSecondary" paragraph>
      {loggedIn ? (
        <>
          <Translation id="editdialog.loggedInMessage" values={{ osmUser }} /> (
          <button
            type="button"
            className="linkLikeButton"
            onClick={handleLogout}
          >
            {t('editdialog.logout')}
          </button>
          )
        </>
      ) : (
        <>
          <Translation id="editdialog.anonymousMessage1" />{' '}
          <button
            type="button"
            className="linkLikeButton"
            onClick={handleLogin}
          >
            {t('editdialog.anonymousMessage2_login')}
          </button>
          <Translation id="editdialog.anonymousMessage3" />
        </>
      )}
    </Typography>
  );
};
