import { useClimbingContext } from '../contexts/ClimbingContext';
import { usePhotoChange } from './usePhotoChange';
import React from 'react';
import { useUserSettingsContext } from '../../../utils/UserSettingsContext';

export const useClimbingViewShortcuts = () => {
  const {
    setIsEditMode,
    setIsRoutesLayerVisible,
    isRoutesLayerVisible,
    photoPath,
    photoPaths,
    isEditMode,
  } = useClimbingContext();
  const onPhotoChange = usePhotoChange();
  const { userSettings, setUserSetting } = useUserSettingsContext();

  React.useEffect(() => {
    const downHandler = (e) => {
      if (e.shiftKey && e.key === 'H') {
        setIsRoutesLayerVisible(!isRoutesLayerVisible);
      }
      if (e.key === 'ArrowLeft') {
        const currentIndex = photoPaths.indexOf(photoPath);
        if (currentIndex > 0) {
          const previousPhoto = photoPaths[currentIndex - 1];
          onPhotoChange(previousPhoto);
        }
      }
      if (e.key === 'ArrowRight') {
        const currentIndex = photoPaths.indexOf(photoPath);
        if (currentIndex < photoPaths.length - 1) {
          const nextPhoto = photoPaths[currentIndex + 1];
          onPhotoChange(nextPhoto);
        }
      }
      if (e.key === 'Escape') {
        setIsEditMode(false);
      }
      if (e.shiftKey && e.key === 'D') {
        setUserSetting(
          'climbing.cragViewLayout',
          userSettings['climbing.cragViewLayout'] === 'horizontal'
            ? 'vertical'
            : 'horizontal',
        );
      }
      if (!isEditMode && e.key === 'e') {
        setIsEditMode(true);
      }
    };

    window.addEventListener('keydown', downHandler);

    return () => {
      window.removeEventListener('keydown', downHandler);
    };
  }, [
    isRoutesLayerVisible,
    setIsRoutesLayerVisible,
    setIsEditMode,
    photoPaths,
    photoPath,
    onPhotoChange,
  ]);
};
