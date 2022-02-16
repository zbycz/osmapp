import useTheme from '@material-ui/core/styles/useTheme';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import React, { useState } from 'react';
import Dialog from '@material-ui/core/Dialog';
import styled from 'styled-components';
import DialogContent from '@material-ui/core/DialogContent';
import { Box, DialogActions } from '@material-ui/core';
import { FeatureTags } from '../../../services/types';
import { getLabel } from '../../../helpers/featureLabel';
import { t } from '../../../services/intl';
import { useOsmAuthContext } from '../../utils/OsmAuthContext';

export const useIsFullScreen = () => {
  const theme = useTheme();
  return useMediaQuery(theme.breakpoints.down('sm'));
};

export const useTagsState = (
  initialTags: FeatureTags,
): [FeatureTags, (k: string, v: string) => void] => {
  const [tags, setTags] = useState(initialTags);
  const setTag = (k, v) => setTags((state) => ({ ...state, [k]: v }));
  return [tags, setTag];
};

export const useGetDialogTitle = (isAddPlace, isUndelete, feature) => {
  const { loggedIn } = useOsmAuthContext();
  if (isAddPlace) return t('editdialog.add_heading');
  if (isUndelete) return t('editdialog.undelete_heading');
  if (!loggedIn)
    return `${t('editdialog.suggest_heading')} ${getLabel(feature)}`;
  return `${t('editdialog.edit_heading')} ${getLabel(feature)}`;
};

export const StyledDialog = styled(Dialog)`
  .MuiDialog-container.MuiDialog-scrollPaper {
    align-items: start;
  }
`;

export const ResponsiveDialogContent = ({ children, actionButtons }) => {
  const fullScreen = useIsFullScreen();

  if (fullScreen) {
    return (
      <DialogContent dividers>
        {children}
        <Box textAlign="right" mt={8}>
          {actionButtons}
        </Box>
      </DialogContent>
    );
  }
  return (
    <>
      <DialogContent dividers>{children}</DialogContent>
      <DialogActions>{actionButtons}</DialogActions>
    </>
  );
};
