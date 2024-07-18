import { Box, Typography } from '@mui/material';
import React from 'react';
import { useOsmAuthContext } from '../../../utils/OsmAuthContext';
import { Translation } from '../../../../services/intl';

export const ContributionInfoBox = () => {
  const { loggedIn } = useOsmAuthContext();
  return loggedIn ? (
    <Box mt={4} mb={4}>
      <Typography variant="body1" color="textSecondary" paragraph>
        <Translation id="editdialog.info_edit" />
      </Typography>
    </Box>
  ) : (
    <Box mt={4} mb={4}>
      <Typography variant="body1" color="textSecondary" paragraph>
        <Translation id="editdialog.info_note" />
      </Typography>
    </Box>
  );
};
