import React, { useEffect, useRef } from 'react';
import styled from '@emotion/styled';
import AddIcon from '@mui/icons-material/Add';
import Router, { useRouter } from 'next/router';
import {
  Dialog,
  DialogContent,
  DialogActions,
  Button,
  Stack,
} from '@mui/material';
import { ClimbingView } from './ClimbingView';
import { useClimbingContext } from './contexts/ClimbingContext';
import { ClimbingCragDialogHeader } from './ClimbingCragDialogHeader';
import { getOsmappLink } from '../../../services/helpers';
import { useFeatureContext } from '../../utils/FeatureContext';
import { useGetHandleSave } from './useGetHandleSave';
import { getWikimediaCommonsPhotoKeys, removeFilePrefix } from './utils/photo';
import { useMobileMode } from '../../helpers';
import { ClimbingEditorHelperText } from './ClimbingEditorHelperText';

const Flex = styled.div`
  display: flex;
  justify-content: space-between;
  width: 100%;
  align-items: center;
  gap: 16px;
`;
const LeftActions = styled.div`
  flex: 1;
`;

export const ClimbingCragDialog = ({
  photo,
  routeNumber,
}: {
  photo?: string;
  routeNumber?: number;
}) => {
  const contentRef = useRef(null);

  const {
    setScrollOffset,
    isPointMoving,
    setIsEditMode,
    isEditMode,
    getMachine,
    showDebugMenu,
    setRouteSelectedIndex,
    routes,
    setPhotoPath,
    photoPath,
    photoPaths,
  } = useClimbingContext();
  const { feature } = useFeatureContext();
  const handleSave = useGetHandleSave(setIsEditMode);
  const machine = getMachine();
  const router = useRouter();
  const featureLink = getOsmappLink(feature);

  useEffect(() => {
    const tags = routes[routeNumber]?.feature?.tags || {};
    const photos = getWikimediaCommonsPhotoKeys(tags);

    if (routeNumber !== undefined && photos?.[0]) {
      setRouteSelectedIndex(routeNumber);
      const firstPhoto = tags[photos[0]];
      const newPhotoPath = removeFilePrefix(firstPhoto);
      router.replace(`${featureLink}/climbing/photo/${newPhotoPath}`);
      setPhotoPath(newPhotoPath);
    } else if (photo) {
      setPhotoPath(photo);
    } else if (!photoPath && photoPaths?.length > 0) {
      setPhotoPath(photoPaths[0]);
      if (routeNumber !== undefined) setRouteSelectedIndex(routeNumber);
    }
  }, [
    featureLink,
    photo,
    photoPath,
    photoPaths,
    routeNumber,
    router,
    routes,
    setPhotoPath,
    setRouteSelectedIndex,
  ]);

  const onScroll = (e) => {
    setScrollOffset({
      x: e.target.scrollLeft,
      y: e.target.scrollTop,
      units: 'px',
    });
  };

  const handleClose = () => {
    if (
      isEditMode &&
      window.confirm(
        'Are you sure you want to close this window? You might loose your changes.',
      ) === false
    ) {
      return;
    }

    Router.push(`${getOsmappLink(feature)}${window.location.hash}`);
  };
  const handleCancel = () => {
    setIsEditMode(false);
  };

  const onNewRouteCreate = () => {
    machine.execute('createRoute');
  };

  return (
    <Dialog fullScreen open onClose={handleClose}>
      <ClimbingCragDialogHeader onClose={handleClose} />

      <DialogContent
        dividers
        style={{
          overscrollBehavior: isPointMoving ? 'none' : undefined,
          padding: 0,
        }}
        ref={contentRef}
        onScroll={onScroll}
      >
        <ClimbingView photo={photo} />
      </DialogContent>

      {isEditMode && (
        <DialogActions>
          <Flex>
            <LeftActions>
              {showDebugMenu && (
                <Button
                  onClick={onNewRouteCreate}
                  color="primary"
                  startIcon={<AddIcon />}
                >
                  Add new route
                </Button>
              )}
              <div style={{ display: 'flex', justifyContent: 'center' }}>
                <ClimbingEditorHelperText />
              </div>
            </LeftActions>
            <div>
              <Stack spacing={2} direction="row">
                <Button autoFocus onClick={handleCancel}>
                  Cancel
                </Button>

                <Button
                  onClick={handleSave}
                  variant="contained"
                  color="primary"
                >
                  Save
                </Button>
              </Stack>
            </div>
          </Flex>
        </DialogActions>
      )}
    </Dialog>
  );
};
