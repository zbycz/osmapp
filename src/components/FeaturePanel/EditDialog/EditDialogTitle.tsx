import { DialogTitle } from '@mui/material';
import React from 'react';
import { useEditDialogFeature } from './utils';
import { useUserThemeContext } from '../../../helpers/theme';
import Maki from '../../utils/Maki';
import { useOsmAuthContext } from '../../utils/OsmAuthContext';
import { t } from '../../../services/intl';
import { getLabel } from '../../../helpers/featureLabel';

const useGetDialogTitle = (isAddPlace, isUndelete, feature) => {
  const { loggedIn } = useOsmAuthContext();
  if (isAddPlace) return t('editdialog.add_heading');
  if (isUndelete) return t('editdialog.undelete_heading');
  if (!loggedIn)
    return `${t('editdialog.suggest_heading')} ${getLabel(feature)}`;
  return `${t('editdialog.edit_heading')} ${getLabel(feature)}`;
};

export const EditDialogTitle = () => {
  const { feature, isAddPlace, isUndelete } = useEditDialogFeature();

  const { currentTheme } = useUserThemeContext();
  const dialogTitle = useGetDialogTitle(isAddPlace, isUndelete, feature);
  return (
    <DialogTitle id="edit-dialog-title">
      <Maki
        ico={feature.properties.class}
        size={16}
        invert={currentTheme === 'dark'}
      />{' '}
      {dialogTitle}
    </DialogTitle>
  );
};
