import { Button, CircularProgress, DialogActions } from '@mui/material';
import React from 'react';
import { t } from '../../../../services/intl';
import { useEditContext } from '../EditContext';
import { useOsmAuthContext } from '../../../utils/OsmAuthContext';
import { useGetHandleSave } from '../useGetHandleSave';
import { useEditDialogContext } from '../../helpers/EditDialogContext';

const SaveButton = () => {
  const { loggedIn } = useOsmAuthContext();
  const handleSave = useGetHandleSave();

  return (
    <Button onClick={handleSave} color="primary" variant="contained">
      {loggedIn
        ? t('editdialog.save_button_edit')
        : t('editdialog.save_button_note')}
    </Button>
  );
};

const CancelButton = () => {
  const { close } = useEditDialogContext();

  return (
    <Button onClick={close} color="primary">
      {t('editdialog.cancel_button')}
    </Button>
  );
};

export const EditDialogActions = () => {
  const { isSaving } = useEditContext();

  return (
    <DialogActions>
      {isSaving && <CircularProgress size={20} />}
      <CancelButton />
      <SaveButton />
    </DialogActions>
  );
};
