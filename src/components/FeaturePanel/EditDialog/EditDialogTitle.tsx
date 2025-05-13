import { DialogTitle, IconButton, Stack } from '@mui/material';
import React from 'react';
import { useEditDialogFeature } from './utils';
import { useOsmAuthContext } from '../../utils/OsmAuthContext';
import { t } from '../../../services/intl';
import CommentIcon from '@mui/icons-material/Comment';
import EditIcon from '@mui/icons-material/Edit';
import { useEditContext } from './EditContext';
import CloseIcon from '@mui/icons-material/Close';
import { useEditDialogContext } from '../helpers/EditDialogContext';

const useGetDialogTitle = (isAddPlace, isUndelete, feature) => {
  const { loggedIn } = useOsmAuthContext();
  const { items } = useEditContext();
  if (isAddPlace) return t('editdialog.add_heading');
  if (isUndelete) return t('editdialog.undelete_heading');
  if (!loggedIn) {
    if (items.length > 1)
      return `${t('editdialog.suggest_heading')}: ${items.length} ${t('editdialog.items')}`;
    return `${t('editdialog.suggest_heading')}`;
  }

  if (items.length > 1)
    return `${t('editdialog.edit_heading')}: ${items.length} ${t('editdialog.items')}`;
  return `${t('editdialog.edit_heading')}`;
};

export const EditDialogTitle = () => {
  const { loggedIn } = useOsmAuthContext();
  const { feature, isAddPlace, isUndelete } = useEditDialogFeature();
  const { close } = useEditDialogContext();

  const dialogTitle = useGetDialogTitle(isAddPlace, isUndelete, feature);

  return (
    <DialogTitle id="edit-dialog-title">
      <Stack
        direction="row"
        gap={1}
        alignItems="center"
        justifyContent="space-between"
      >
        <Stack direction="row" gap={2} alignItems="center">
          {loggedIn ? <EditIcon /> : <CommentIcon />}
          {dialogTitle}
        </Stack>

        <IconButton color="secondary" edge="end" onClick={close}>
          <CloseIcon fontSize="small" />
        </IconButton>
      </Stack>
    </DialogTitle>
  );
};
