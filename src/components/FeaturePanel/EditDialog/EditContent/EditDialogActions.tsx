import { Button, CircularProgress, DialogActions } from '@mui/material';
import React from 'react';
import { t } from '../../../../services/intl';
import { useEditContext } from '../context/EditContext';
import { useOsmAuthContext } from '../../../utils/OsmAuthContext';
import { useGetHandleSave } from '../useGetHandleSave';
import { useEditDialogContext } from '../../helpers/EditDialogContext';
import { getDiffXml } from '../../../../services/osm/auth/getDIffXml';

const downloadFile = (content: string, filename: string) => {
  const file = new Blob([content], { type: 'text/xml' });
  const element = document.createElement('a');
  element.style.display = 'none';
  element.href = URL.createObjectURL(file);
  element.download = filename;
  document.body.appendChild(element);
  element.click();
  document.body.removeChild(element);
};

const SaveButton = () => {
  const { loggedIn } = useOsmAuthContext();
  const handleSave = useGetHandleSave();
  const { items } = useEditContext();
  const disabled = !items.some((item) => item.modified);

  return (
    <Button
      onClick={handleSave}
      color="primary"
      variant="contained"
      disabled={disabled}
    >
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

const DownloadButton = (props: { onClick: () => void }) => (
  <Button
    variant="text"
    color="secondary"
    sx={{ fontSize: '11px', textTransform: 'none' }}
    onClick={props.onClick}
  >
    {t('editdialog.download_osc')}
  </Button>
);

export const EditDialogActions = () => {
  const { isSaving, items } = useEditContext();

  const download = () => {
    const content = getDiffXml(items);
    downloadFile(content, 'changes.osc');
  };

  return (
    <DialogActions>
      <DownloadButton onClick={download} />
      <div style={{ flex: '1 1' }}></div>
      {isSaving && <CircularProgress size={20} />}
      <CancelButton />

      <SaveButton />
    </DialogActions>
  );
};
