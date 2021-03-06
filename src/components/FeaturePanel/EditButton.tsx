import Button from '@material-ui/core/Button';
import EditIcon from '@material-ui/icons/Edit';
import AddLocationIcon from '@material-ui/icons/AddLocation';
import React from 'react';
import { Box } from '@material-ui/core';
import { t } from '../../services/intl';

export const EditButton = ({ isAddPlace, isUndelete, setDialogOpenedWith }) => (
  <Box mt={3} mb={3} mx="auto" clone>
    <Button
      size="large"
      startIcon={isAddPlace || isUndelete ? <AddLocationIcon /> : <EditIcon />}
      variant="outlined"
      color="primary"
      onClick={() => setDialogOpenedWith(true)}
    >
      {isAddPlace
        ? t('featurepanel.add_place_button')
        : isUndelete
        ? t('featurepanel.undelete_button')
        : t('featurepanel.edit_button')}
    </Button>
  </Box>
);
