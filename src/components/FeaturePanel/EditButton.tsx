import Button from '@material-ui/core/Button';
import EditIcon from '@material-ui/icons/Edit';
import AddLocationIcon from '@material-ui/icons/AddLocation';
import React from 'react';
import { Box } from '@material-ui/core';
import { t } from '../../services/intl';
import { useOsmAuthContext } from '../utils/OsmAuthContext';
import { useEditDialogContext } from './helpers/EditDialogContext';

const getLabel = (loggedIn, isAddPlace, isUndelete) => {
  if (isAddPlace) return t('featurepanel.add_place_button');
  if (isUndelete) return t('featurepanel.undelete_button');
  if (loggedIn) return t('featurepanel.edit_button');
  return t('featurepanel.note_button');
};

export const EditButton = ({ isAddPlace, isUndelete }) => {
  const { loggedIn } = useOsmAuthContext();
  const { open } = useEditDialogContext();

  return (
    <Box mt={3} mb={3} mx="auto" clone>
      <Button
        size="large"
        startIcon={
          isAddPlace || isUndelete ? <AddLocationIcon /> : <EditIcon />
        }
        variant="outlined"
        color="primary"
        onClick={open}
      >
        {getLabel(loggedIn, isAddPlace, isUndelete)}
      </Button>
    </Box>
  );
};
