import React, { useEffect, useState } from 'react';
import { Dialog, useMediaQuery, useTheme } from '@mui/material';
import styled from '@emotion/styled';
import { SuccessContent } from './SuccessContent';
import { useEditDialogContext } from '../helpers/EditDialogContext';
import { EditDialogTitle } from './EditDialogTitle';
import { useEditDialogFeature } from './utils';
import { EditContextProvider, useEditContext } from './EditContext';
import { EditContent } from './EditContent/EditContent';
import { getReactKey } from '../../../services/helpers';
import { fetchFreshItem, getNewNodeItem } from './itemsHelpers';
import { DataItem } from './useEditItems';

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
  const { opened, close } = useEditDialogContext();
  const { successInfo } = useEditContext();
  const fullScreen = useIsFullScreen();

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
      onClose={close}
      disableEscapeKeyDown
      aria-labelledby="edit-dialog-title"
      sx={{ height: '100%' }}
    >
      <EditDialogTitle />
      {successInfo ? <SuccessContent /> : <EditContent />}
    </StyledDialog>
  );
};

const EditDialogFetcher = () => {
  const { feature } = useEditDialogFeature();

  const [initialItem, setInitialItem] = useState<DataItem | undefined>();

  useEffect(() => {
    (async () => {
      if (feature.osmMeta.id < 0) {
        const newItem = getNewNodeItem(feature.center);
        setInitialItem(newItem);
      } else {
        const newItem = await fetchFreshItem(feature.osmMeta); // TODO potentially leaking - use react-query (with max repetions 10?)
        setInitialItem(newItem);
      }
    })();
  }, [feature]);

  if (!initialItem) {
    return null;
  }

  return (
    <EditContextProvider initialItem={initialItem}>
      <EditDialogInner />
    </EditContextProvider>
  );
};

export const EditDialog = () => {
  const { feature } = useEditDialogFeature();

  return <EditDialogFetcher key={getReactKey(feature)} />;
};
