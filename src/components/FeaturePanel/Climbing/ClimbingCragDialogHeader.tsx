import React, { useState } from 'react';
import Router from 'next/router';
import styled from '@emotion/styled';
import CloseIcon from '@mui/icons-material/Close';
import TuneIcon from '@mui/icons-material/Tune';
import {
  AppBar,
  Box,
  IconButton,
  Toolbar,
  Tooltip,
  Typography,
} from '@mui/material';
import { useClimbingContext } from './contexts/ClimbingContext';
import { PhotoLink } from './PhotoLink';
import { useFeatureContext } from '../../utils/FeatureContext';
import { getLabel } from '../../../helpers/featureLabel';
import { getOsmappLink } from '../../../services/helpers';
import { UserSettingsDialog } from '../../HomepagePanel/UserSettingsDialog';
import { useDragItems } from '../../utils/useDragItems';
import { moveElementToIndex } from './utils/array';
import { t } from '../../../services/intl';
import { usePhotoChange } from './utils/usePhotoChange';

const Title = styled.div`
  flex: 1;
  overflow: hidden;
`;

const PhotosContainer = styled.div`
  display: flex;
  flex-direction: row;
  gap: 8px;
  align-items: center;
`;

const PhotosTitle = styled.div`
  color: ${({ theme }) => theme.palette.text.secondary};
`;

const PhotoLinks = styled.div`
  display: flex;
  flex-wrap: wrap;
  flex-direction: row;
  gap: 4px;
  margin-bottom: 2px;
`;

export const ClimbingCragDialogHeader = ({ onClose }) => {
  const [isUserSettingsOpened, setIsUserSettingsOpened] =
    useState<boolean>(false);
  const [clickCounter, setClickCounter] = useState<number>(0);
  const { photoPath, photoPaths, setShowDebugMenu, isEditMode, setPhotoPaths } =
    useClimbingContext();

  const { feature } = useFeatureContext();
  const onPhotoChange = usePhotoChange();

  const label = getLabel(feature);

  const handleOnClick = () => {
    setClickCounter(clickCounter + 1);
    if (clickCounter === 4) {
      setShowDebugMenu(true);
      setClickCounter(0);
    }
  };

  const movePhotos = (_oldIndex, _newIndex) => {
    // @TODO: Implement moving photos
  };

  const {
    handleDragStart,
    handleDragOver,
    handleDragEnd,
    HighlightedDropzone,
    ItemContainer,
    draggedItem,
    draggedOverIndex,
  } = useDragItems<string>({
    initialItems: photoPaths,
    moveItems: movePhotos,
    direction: 'vertical',
  });

  return (
    <AppBar position="static" color="transparent">
      <Toolbar variant="dense">
        <Title>
          <Typography
            noWrap
            variant="h5"
            component="div"
            onClick={handleOnClick}
            fontFamily={'Piazzolla'}
          >
            {label}
          </Typography>
          {photoPaths?.length > 1 && (
            <PhotosContainer>
              <Typography variant="caption" color="secondary">
                {t('climbing.photos')}
              </Typography>
              <PhotoLinks>
                {photoPaths.map((photo, index) => (
                  <ItemContainer key={photo}>
                    <PhotoLink
                      key={photo}
                      photo={photo}
                      onClick={() => onPhotoChange(photo)}
                      isCurrentPhoto={photo === photoPath}
                      {...(isEditMode
                        ? {
                            draggable: true,
                            onDragStart: (e) => {
                              handleDragStart(e, {
                                id: index,
                                content: photo,
                              });
                            },
                            onDragOver: (e) => {
                              handleDragOver(e, index);
                            },
                            onDragEnd: (e) => {
                              handleDragEnd(e);

                              const newArray = moveElementToIndex(
                                photoPaths,
                                draggedItem.id,
                                draggedOverIndex,
                              );

                              setPhotoPaths(newArray);
                            },
                          }
                        : {})}
                    >
                      {index}
                    </PhotoLink>
                    <HighlightedDropzone index={index} />
                  </ItemContainer>
                ))}
              </PhotoLinks>
            </PhotosContainer>
          )}
        </Title>

        <Box mr={2}>
          <Tooltip title="Show settings">
            <IconButton
              color="primary"
              edge="end"
              onClick={() => {
                setIsUserSettingsOpened(!isUserSettingsOpened);
              }}
            >
              <TuneIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        </Box>
        <Tooltip title="Close crag detail">
          <IconButton color="primary" edge="end" onClick={onClose}>
            <CloseIcon fontSize="small" />
          </IconButton>
        </Tooltip>
      </Toolbar>
      <UserSettingsDialog
        isOpened={isUserSettingsOpened}
        onClose={() => setIsUserSettingsOpened(false)}
      />
    </AppBar>
  );
};
