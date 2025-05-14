import React, { useEffect } from 'react';
import { Dialog, useMediaQuery, useTheme } from '@mui/material';
import styled from '@emotion/styled';
import { useEditDialogContext } from '../helpers/EditDialogContext';
import { useEditDialogFeature } from './utils';
import { EditContextProvider, useEditContext } from './EditContext';
import { getReactKey } from '../../../services/helpers';
import { fetchFreshItem, getNewNodeItem } from './itemsHelpers';
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
  const { items } = useEditContext();
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
  const { current, addItem, setCurrent } = useEditContext();

  useEffect(() => {
    (async () => {
      if (feature.osmMeta.id < 0) {
        const newItem = getNewNodeItem(feature.center);
        addItem(newItem);
        setCurrent(newItem.shortId);
      } else {
        const newItem = await fetchFreshItem(feature.osmMeta); // TODO potentially leaking - use react-query (with max repetions 10?)
        addItem(newItem);
        setCurrent(newItem.shortId);
      }
    })();
  }, [addItem, feature, setCurrent]);

  if (!current) {
    return <EditDialogLoadingSkeleton />;
  }
  return <EditDialogContent />;
};

export const EditDialog = () => {
  const { opened } = useEditDialogContext();
  const { feature } = useEditDialogFeature();

  if (!opened) {
    return null;
  }

  return (
    <EditContextProvider key={getReactKey(feature)}>
      {/*dialog has to be mounted only once - it has animation*/}
      <CustomizedDialog>
        <EditDialogFetcher />
      </CustomizedDialog>
    </EditContextProvider>
  );
};
