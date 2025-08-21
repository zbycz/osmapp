import React from 'react';
import { TransformWrapper as Wrapper } from 'react-zoom-pan-pinch';
import { useClimbingContext } from './contexts/ClimbingContext';
import { ZoomState } from './types';

export const TransformWrapper = ({ children }) => {
  const {
    setArePointerEventsDisabled,
    setPhotoZoom,
    isEditMode,
    isPanningDisabled,
    isAddingPointBlockedRef,
  } = useClimbingContext();

  const startPointerEvents = () => {
    setArePointerEventsDisabled(false);
  };
  const stopPointerEvents = () => {
    setArePointerEventsDisabled(true);
  };

  const handlePanningStart = () => {
    startPointerEvents();
  };

  const handlePanning = () => {
    if (!isAddingPointBlockedRef.current) {
      isAddingPointBlockedRef.current = true;
    }
  };

  const handlePanningStop = () => {
    startPointerEvents();
    setTimeout(() => {
      isAddingPointBlockedRef.current = false;
    }, 300);
  };

  return (
    <Wrapper
      doubleClick={{
        disabled: isEditMode,
        mode: 'toggle',
        step: 1,
        animationTime: 150,
      }}
      onWheelStart={stopPointerEvents}
      onWheelStop={startPointerEvents}
      onPinchingStart={stopPointerEvents}
      onPinchingStop={startPointerEvents}
      onZoomStart={stopPointerEvents}
      onZoomStop={startPointerEvents}
      onPanningStart={handlePanningStart}
      onPanning={handlePanning}
      onPanningStop={handlePanningStop}
      disablePadding
      panning={{ disabled: isPanningDisabled }}
      wheel={{ step: 100 }}
      centerOnInit
      onTransformed={(_ref, state: ZoomState) => {
        setPhotoZoom(state);
      }}
    >
      {children}
    </Wrapper>
  );
};
