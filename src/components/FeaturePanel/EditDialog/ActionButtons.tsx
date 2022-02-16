import { CircularProgress } from '@material-ui/core';
import Button from '@material-ui/core/Button';
import React from 'react';
import { t } from '../../../services/intl';
import { useOsmAuthContext } from '../../utils/OsmAuthContext';

interface ActionButtonsProps {
  loading: boolean;
  onClose: () => void;
  handleSave: () => void;
  cancelled: boolean;
}

export const ActionButtons = ({
  cancelled,
  loading,
  onClose,
  handleSave,
}: ActionButtonsProps) => {
  const { loggedIn } = useOsmAuthContext();
  return (
    <>
      {loading && <CircularProgress size={20} />}
      <Button onClick={onClose} color="primary">
        {t('editdialog.cancel_button')}
      </Button>
      <Button onClick={handleSave} color="primary" variant="contained">
        {loggedIn
          ? cancelled
            ? t('editdialog.save_button_delete')
            : t('editdialog.save_button_edit')
          : t('editdialog.save_button_note')}
      </Button>
    </>
  );
};
