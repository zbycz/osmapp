import React, { useState } from 'react';
import styled from 'styled-components';
import { AppBar, Toolbar, Typography, IconButton } from '@material-ui/core';
import CloseIcon from '@material-ui/icons/Close';
import TuneIcon from '@material-ui/icons/Tune';
import { useClimbingContext } from './contexts/ClimbingContext';
import { ClimbingSettings } from './ClimbingSettings';

const Title = styled.div`
  flex: 1;
`;

export const ClimbingDialogHeader = ({
  isFullscreenDialogOpened,
  setIsFullscreenDialogOpened,
  imageRef,
}) => {
  const [isSettingsOpened, setIsSettingsOpened] = useState<boolean>(false);
  const { areRoutesVisible, setPhotoPath, handleImageLoad } =
    useClimbingContext();

  const onPhotoChange = (photoPath: string) => {
    setPhotoPath(photoPath);
    setTimeout(() => {
      // @TODO fix it without timeout
      handleImageLoad(imageRef);
    }, 100);
  };

  return (
    <AppBar position="static" color="transparent">
      <Toolbar variant="dense">
        <Title>
          <Typography variant="h6" component="div">
            Jickovice: Hlavní oblast - patro
          </Typography>
          <a onClick={() => onPhotoChange('/images/jickovice1.jpg')}>
            jickovice1
          </a>{' '}
          |{' '}
          <a onClick={() => onPhotoChange('/images/jickovice2.jpg')}>
            jickovice2
          </a>{' '}
          |{' '}
          <a onClick={() => onPhotoChange('/images/jickovice3.jpg')}>
            jickovice3
          </a>{' '}
          {/* | <a onClick={() => onPhotoChange('/images/rock.png')}>photo 2</a> |{' '}
          <a
            onClick={() =>
              onPhotoChange(
                'https://www.skalnioblasti.cz/image.php?typ=skala&id=13516',
              )
            }
          >
            photo 3
          </a>{' '}
          |{' '}
          <a
            onClick={() =>
              onPhotoChange(
                'https://image.thecrag.com/2063x960/5b/ea/5bea45dd2e45a4d8e2469223dde84bacf70478b5',
              )
            }
          >
            photo 4
          </a> */}
        </Title>

        <IconButton
          color="primary"
          edge="end"
          title={areRoutesVisible ? 'Hide routes' : 'Show routes'}
          onClick={() => {
            setIsSettingsOpened(!isSettingsOpened);
          }}
        >
          <TuneIcon fontSize="small" />
        </IconButton>

        {isFullscreenDialogOpened && (
          <IconButton
            color="primary"
            edge="end"
            onClick={() => {
              setIsFullscreenDialogOpened(!isFullscreenDialogOpened);
            }}
          >
            <CloseIcon fontSize="small" />
          </IconButton>
        )}
      </Toolbar>
      <ClimbingSettings
        isSettingsOpened={isSettingsOpened}
        setIsSettingsOpened={setIsSettingsOpened}
      />
    </AppBar>
  );
};
