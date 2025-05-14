import React, { useEffect, useState } from 'react';
import { Dialog, useMediaQuery, useTheme } from '@mui/material';
import styled from '@emotion/styled';
import { useEditDialogContext } from '../helpers/EditDialogContext';
import { useEditDialogFeature } from './utils';
import { EditContextProvider, useEditContext } from './EditContext';
import { getReactKey } from '../../../services/helpers';
import { fetchFreshItem, getNewNodeItem } from './itemsHelpers';
import { DataItem } from './useEditItems';
import {
  EditDialogContent,
  EditDialogLoadingSkeleton,
} from './EditDialogContent';

const useIsFullScreen = () => {
  const theme = useTheme();
  return useMediaQuery(theme.breakpoints.down('md'));
};
const StyledDialog = styled(Dialog)`
  .MuiDialog-container.MuiDialog-scrollPaper {
    align-items: start;
  }
`;
const CustomizedDialog: React.FC = ({ children }) => {
  const { opened, close } = useEditDialogContext();
  const fullScreen = useIsFullScreen();
  const { items } = useEditContext() ?? { items: [] };
  const hasMoreItems = items.length > 1;

  return (
    <StyledDialog
      PaperProps={{
        sx: {
          height: '100%',
          maxWidth: hasMoreItems ? 1100 : 900,
        },
      }}
      fullScreen={fullScreen}
      open={opened}
      onClose={close}
      disableEscapeKeyDown
      aria-labelledby="edit-dialog-title"
      sx={{ height: '100%' }}
    >
      {children}
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
    return <EditDialogLoadingSkeleton />;
  }

  return (
    <EditContextProvider initialItem={initialItem}>
      <EditDialogContent />
    </EditContextProvider>
  );
};

export const EditDialog = () => {
  const { opened } = useEditDialogContext();
  const { feature } = useEditDialogFeature();

  if (!opened) {
    return null;
  }

  return (
    // dialog has to be mounted only once - it has animation
    <CustomizedDialog>
      <EditDialogFetcher key={getReactKey(feature)} />
    </CustomizedDialog>
  );
};
