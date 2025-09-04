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
  const { successInfo } = useEditContext();
  return (
    <StyledDialog
      fullScreen={fullScreen}
      open={opened}
      onClose={close}
      disableEscapeKeyDown={!successInfo}
      aria-labelledby="edit-dialog-title"
      slotProps={{
        paper: {
          sx: {
            height: '100%',
            maxWidth: hasMoreItems ? 1100 : 900,
          },
          elevation: 0,
        },
      }}
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
    if (current) {
      return; // for development
    }

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
  }, [addItem, current, feature, setCurrent]);

  if (!current) {
    return <EditDialogLoadingSkeleton />;
  }
  return <EditDialogContent />;
};

export const EditDialog = () => {
  const { opened } = useEditDialogContext();
  const { feature } = useEditDialogFeature();

  return (
    <EditContextProvider key={getReactKey(feature)}>
      {opened && (
        <CustomizedDialog>
          <EditDialogFetcher />
        </CustomizedDialog>
      )}
    </EditContextProvider>
  );
};
