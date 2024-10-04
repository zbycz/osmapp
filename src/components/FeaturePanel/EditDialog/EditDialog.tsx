import React from 'react';
import { Dialog, useMediaQuery, useTheme } from '@mui/material';
import styled from '@emotion/styled';
import { SuccessContent } from './SuccessContent';
import { useEditDialogContext } from '../helpers/EditDialogContext';
import { EditDialogTitle } from './EditDialogTitle';
import { useEditDialogFeature } from './utils';
import { EditContextProvider, useEditContext } from './EditContext';
import { useGetOnClose } from './useGetOnClose';
import { EditContent } from './EditContent/EditContent';
import { getKey } from '../../../services/helpers';

const useIsFullScreen = () => {
  const theme = useTheme();
  return useMediaQuery(theme.breakpoints.down('sm'));
};

const StyledDialog = styled(Dialog)`
  .MuiDialog-container.MuiDialog-scrollPaper {
    align-items: start;
  }
`;

const EditDialogInner = () => {
  const { opened } = useEditDialogContext();
  const { successInfo } = useEditContext();
  const fullScreen = useIsFullScreen();
  const onClose = useGetOnClose();

  return (
    <StyledDialog
      maxWidth="md"
      fullScreen={fullScreen}
      open={opened}
      onClose={onClose}
      aria-labelledby="edit-dialog-title"
    >
      <EditDialogTitle />
      {successInfo ? <SuccessContent /> : <EditContent />}
    </StyledDialog>
  );
};

export const EditDialog = () => {
  const { feature } = useEditDialogFeature();

  return (
    <EditContextProvider feature={feature} key={getKey(feature)}>
      <EditDialogInner />
    </EditContextProvider>
  );
};
