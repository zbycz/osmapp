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
import { getFullFeatureWithMemberFeatures } from '../../../services/osm/getFullFeatureWithMemberFeatures';
import { Feature } from '../../../services/types';

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

  const [freshFeature, setFreshFeature] = useState<Feature>();

  useEffect(() => {
    (async () => {
      // to ensure the feature is fresh+contains all editable parts we load it here.
      // - eg. nodesRefs for ways which we dont normally download)
      // - eg. all members as memberFeatures

      if (feature.osmMeta.id < 0) {
        setFreshFeature(feature);
      } else {
        const newFeature = await getFullFeatureWithMemberFeatures(
          feature.osmMeta,
        );
        setFreshFeature(newFeature);
      }
    })();
  }, [feature]);

  if (!freshFeature) {
    return null;
  }

  return (
    <EditContextProvider
      originalFeature={freshFeature}
      key={getReactKey(feature)}
    >
      <EditDialogInner />
    </EditContextProvider>
  );
};
