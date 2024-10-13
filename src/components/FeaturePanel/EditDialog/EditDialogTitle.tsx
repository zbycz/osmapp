import { DialogTitle, Stack } from '@mui/material';
import React from 'react';
import { useEditDialogFeature } from './utils';
import { useOsmAuthContext } from '../../utils/OsmAuthContext';
import { t } from '../../../services/intl';
import { getLabel } from '../../../helpers/featureLabel';
import CommentIcon from '@mui/icons-material/Comment';
import EditIcon from '@mui/icons-material/Edit';

const useGetDialogTitle = (isAddPlace, isUndelete, feature) => {
  const { loggedIn } = useOsmAuthContext();
  if (isAddPlace) return t('editdialog.add_heading');
  if (isUndelete) return t('editdialog.undelete_heading');
  if (!loggedIn)
    return `${t('editdialog.suggest_heading')} ${getLabel(feature)}`;
  return `${t('editdialog.edit_heading')} ${getLabel(feature)}`;
};

export const EditDialogTitle = () => {
  const { loggedIn } = useOsmAuthContext();
  const { feature, isAddPlace, isUndelete } = useEditDialogFeature();

  const dialogTitle = useGetDialogTitle(isAddPlace, isUndelete, feature);

  return (
    <DialogTitle id="edit-dialog-title">
      <Stack direction="row" gap={1} alignItems="center">
        {loggedIn ? <EditIcon /> : <CommentIcon />}
        {dialogTitle}
      </Stack>
    </DialogTitle>
  );
};
