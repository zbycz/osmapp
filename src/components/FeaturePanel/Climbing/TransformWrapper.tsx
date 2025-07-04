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
    setIsPanningActive,
  } = useClimbingContext();

  const startPointerEvents = () => {
    setArePointerEventsDisabled(false);
  };
  const stopPointerEvents = () => {
    setArePointerEventsDisabled(true);
  };

  const handlePanningStart = () => {
    startPointerEvents();
    setIsPanningActive(true);
  };
  const handlePanningStop = () => {
    startPointerEvents();
    // setIsPanningActive(false);
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
