import { useEffect } from 'react';
import { useClimbingContext } from '../contexts/ClimbingContext';
import { usePhotoChange } from './usePhotoChange';

export const useClimbingViewShortcuts = () => {
  const {
    setIsEditMode,
    setIsRoutesLayerVisible,
    isRoutesLayerVisible,
    photoPath,
    photoPaths,
  } = useClimbingContext();
  const onPhotoChange = usePhotoChange();

  useEffect(() => {
    const downHandler = (e) => {
      if (e.key === 'h') {
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
