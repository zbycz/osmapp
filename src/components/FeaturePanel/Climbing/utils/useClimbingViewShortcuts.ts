import { useEffect } from 'react';
import { useClimbingContext } from '../contexts/ClimbingContext';
import { usePhotoChange } from './usePhotoChange';
import { useUserSettingsContext } from '../../../utils/userSettings/UserSettingsContext';

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
  useEffect(() => {
    const downHandler = (e) => {
      if (e.ctrlKey && e.key === 'h') {
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
      if (e.ctrlKey && e.key === 'd') {
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
    isEditMode,
    setUserSetting,
    userSettings,
  ]);
};
