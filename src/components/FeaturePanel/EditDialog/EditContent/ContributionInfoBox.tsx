import { Box, Typography } from '@mui/material';
import React from 'react';
import { useOsmAuthContext } from '../../../utils/OsmAuthContext';
import { Translation } from '../../../../services/intl';

export const ContributionInfoBox = () => {
  const { loggedIn } = useOsmAuthContext();
  return loggedIn ? (
    <Box mt={1} mb={2}>
      <Typography variant="body2" color="textSecondary">
        <Translation id="editdialog.info_edit" />
      </Typography>
    </Box>
  ) : (
    <Box mt={1} mb={2}>
      <Typography variant="body2" color="textSecondary">
        <Translation id="editdialog.info_note" />
      </Typography>
    </Box>
  );
};
