import { Box, Button } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import AddLocationIcon from '@mui/icons-material/AddLocation';
import React from 'react';
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
