import React, { useEffect, useState } from 'react';
import { Dialog, useMediaQuery, useTheme } from '@mui/material';
import styled from '@emotion/styled';
import { SuccessContent } from './SuccessContent';
import { useEditDialogContext } from '../helpers/EditDialogContext';
import { EditDialogTitle } from './EditDialogTitle';
import { useEditDialogFeature } from './utils';
import { EditContextProvider, useEditContext } from './EditContext';
import { useGetOnClose } from './useGetOnClose';
import { EditContent } from './EditContent/EditContent';
import { getReactKey } from '../../../services/helpers';
import { fetchSchemaTranslations } from '../../../services/tagging/translations';
import { useBoolState } from '../../helpers';

const useIsFullScreen = () => {
  const theme = useTheme();
  return useMediaQuery(theme.breakpoints.down('md'));
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
      PaperProps={{
        sx: {
          height: '100%',
        },
      }}
      maxWidth="xl"
      fullScreen={fullScreen}
      open={opened}
      onClose={onClose}
      disableEscapeKeyDown
      aria-labelledby="edit-dialog-title"
      sx={{ height: '100%' }}
    >
      <EditDialogTitle onClose={onClose} />
      {successInfo ? <SuccessContent /> : <EditContent />}
    </StyledDialog>
  );
};

export const EditDialog = () => {
  const { feature } = useEditDialogFeature();

  const [presetsLoaded, onLoaded] = useBoolState(false);
  useEffect(() => {
    fetchSchemaTranslations().then(onLoaded);
  });
  if (!presetsLoaded) {
    return null;
  }

  return (
    <EditContextProvider originalFeature={feature} key={getReactKey(feature)}>
      <EditDialogInner />
    </EditContextProvider>
  );
};
